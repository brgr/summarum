# svelte-math-editor

The idea of this is to create something like a math editor, i.e. a calculator over multiple lines with variables.

I would like to be able to write something like this:

```
x = 2
y = 3

x + y  # 5
```

The comment, here, should be shown in the editor. That is, the editor should be able to evaluate the expression
and show the result.

The idea of such a tool is not completely new, it exists already, but mainly for MacOS only. These are, namely:
- [Soulver](https://soulver.app)
- [Calca](https://calca.io/)
- [Numi](https://numi.app/)
- [MathNotepad](https://mathnotepad.com/#) (by the `mathjs` author himself)

My idea is that I want those for the web.

# Library for Math Evaluation

I think [math.js](https://mathjs.org/) is a good library for this. It is a comprehensive math library for JavaScript
and Node.js.
