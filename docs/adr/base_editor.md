
# Using CodeMirror6 as the base editor

## Status

Accepted

## Context

### Requirements

We need some form of entering stuff in our Math editor.

What we mainly need there is one or two things (depending on whether one sees the second thing as the part of the editor):
- Real-time highlighting of the math
- Output of the calculated result on the end of the line

The latter could be seen as just static output (without input).
And indeed, it is just that.
However, a math statement might go over several lines, and in these cases I have seen that it is difficult to not
include the result in the `div` of the input.
Hence it's easier to include this in our considerations.

There are further things that we _might_ want:
- Math rendering (e.g. fractions etc.)
- Code completion

These are for now though not hard requirements.

### Constraints

It should work on the web.
It should also work on all desktop devices.

If possible, it should also work on mobile devices.

### Available Options

There are three main categories for options:

1. Creating it ourselves with `contenteditable`
2. Using a _code editor_
3. Using a _WYSIWYG editor_

I tried (1) and (2) so far.

(1) is described in more detail here: https://github.com/bergoo/svelte-math-editor/issues/27
I also tried to do this in the past. It's not easy.

In the end, I kind of got it working by wrapping two `contenteditable` divs in each other, which would also create
further divs for each line.
This is kind of what I want and would look good so far. This also exists in the Git history, I think this commit
should have it: a06de3001faa4e64a22aab639e71ba49d94e11dd. (Maybe a bit later in the history...)

The **problem** here was that the Playwright tests wouldn't work well.
They would for example just not work on Firefox (on Chromium, though, they worked well).
This made me unsure about the whole thing.

**In summary**: There seems to be a lot around `contenteditable` and one needs to be quite well-versed in the DOM.
I don't think I quite got that and I think going with a library is better here.

A note for later though: _It still seems possible!_
I think it should work fine, and when we dig deeper into it we should be able to work it out (also with a lot of JavaScript).
So if the other options don't work out, we can still go back to this.


Then there is (2) and (3).
The main difference is that (3) could show fractions etc. in a more WYSIWYG way.
However, (2) can kind of do that also, depending on the editor.

I tried (2) with CodeMirror6 and so far I like it a lot.
It seems to support everything.
It is a code editor, however even WYSIWYG seems possible with it.
I will talk more about that below in the decision.

Other options of code editors (2) were:
- Monaco: Quite big and not very well documented. But it's the editor of VS Code, so it should be good.
- Ace: I actually don't know much about it.
- cledit (see [here](https://github.com/classeur/cledit)): This is used by StackEdit. It hasn't been updated for a while, but it could be interesting to look at the code.

Then there is (3), WYSIWYG editors.
Options here were:
- Quill: It actually looks quite good and I also created an issue on this: https://github.com/bergoo/svelte-math-editor/issues/7
- TipTap

There might are others (see the issue maybe), but this is the main one I have in mind now.
[Here](https://old.reddit.com/r/vuejs/comments/124ila9/looking_for_wysiwyg_library_for_vue_3/) is also a Reddit discussion.

Another thing to note here is [MathLive](https://cortexjs.io/mathlive/demo/), which looks interesting; though I haven't looked
at it in much detail.

We now go with CodeMirror6.

## Decision

We will use CodeMirror6 as the base editor.

The code at this point (Git commit ead26e609f0ad4aa4c6006899ffb6a1cfd4041a6) includes the editor already, including
also the output of the calculated result. (Actually not that, but some value on the end of the line - we have to replace
that still with the actual output)
The way I got the result at the end of line work was kind of inspired by [this](https://discuss.codemirror.net/t/adding-a-widget-at-the-end-of-line/47)
though I think in the end I solved it differently. (This also refers to CodeMirror5 I think)

Syntax highlighting also works, though I still need to create my own language parser; which should however by quite simple,
as for the beginning I only need to highlight numbers.

Code completion (variables!) can also be made to work.

WYSIWIG is the hardest part.
It should be possible, which is shown by a Markdown implementation in CodeMirror: https://github.com/laobubu/HyperMD.

In general, it is absolutely possible to make text bold etc. 
Customizing text a lot (fractions, tables, etc.) should be quite hard - but maybe possible? I'm not so sure about that,
so we'll need to see.

[Here](https://discuss.codemirror.net/t/implementing-wysiwyg-markdown-editor-in-codemirror/2403) is also a discussion on
WYSIWIG Markdown in CodeMirror.

However, CodeMirror should be a good option also because it is used in many online editors, such as in:
- GitHub code editor (on the page directly - not the one on github.dev, which uses VSCode / Monaco)
- replit
- ShareLatex/Overleaf
- and many more

Some things we might still want to do is:

- Make it work with Svelte

Here is an idea on what that could look like: https://svelte.dev/repl/91649ba3e0ce4122b3b34f3a95a00104?version=3.49.0

- We need to write our own parser. Maybe though we want to sue the `mathjs` parser?

I'm not so sure about this. [Here](https://discuss.codemirror.net/t/writing-a-custom-parser-without-using-lezer-or-streamparser/4692) is
maybe a relevant discussion on this.
