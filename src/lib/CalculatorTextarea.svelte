<script lang="ts">
    import {EditorView} from "codemirror"
    import {onMount} from "svelte";
    import {
        crosshairCursor,
        gutter,
        drawSelection,
        dropCursor,
        highlightActiveLineGutter,
        highlightSpecialChars,
        keymap,
        rectangularSelection
    } from "@codemirror/view";
    import {defaultKeymap, history, historyKeymap} from "@codemirror/commands";
    import {
        bracketMatching,
        defaultHighlightStyle,
        foldKeymap,
        indentOnInput,
        syntaxHighlighting
    } from "@codemirror/language";
    import {EditorState} from "@codemirror/state";
    import {autocompletion, closeBrackets, closeBracketsKeymap, completionKeymap} from "@codemirror/autocomplete";
    import {highlightSelectionMatches, searchKeymap} from "@codemirror/search";
    import {lintKeymap} from "@codemirror/lint";
    import {mathOutputPlugin} from "./math_output_widget_decorator";
    import {example} from "./mathjs_lezer";
    import {lineNumbers, mygutter} from "./mygutter";

    import {GutterMarker} from "./mygutter"
    import {mathjsEvaluate} from "./eval";





    import {StateField, StateEffect, RangeSet} from "@codemirror/state"
    import {myLineNumberGutter, myLineNumbers} from "./output_math_gutter";

    const breakpointEffect = StateEffect.define<{pos: number, on: boolean}>({
        map: (val, mapping) => ({pos: mapping.mapPos(val.pos), on: val.on})
    })

    const breakpointState = StateField.define<RangeSet<GutterMarker>>({
        create() { return RangeSet.empty },
        update(set, transaction) {
            set = set.map(transaction.changes)
            for (let e of transaction.effects) {
                if (e.is(breakpointEffect)) {
                    if (e.value.on)
                        set = set.update({add: [breakpointMarker.range(e.value.pos)]})
                    else
                        set = set.update({filter: from => from != e.value.pos})
                }
            }
            return set
        }
    })

    function toggleBreakpoint(view: EditorView, pos: number) {
        let breakpoints = view.state.field(breakpointState)
        let hasBreakpoint = false
        breakpoints.between(pos, pos, () => {hasBreakpoint = true})
        console.log('dispatching')
        view.dispatch({
            effects: breakpointEffect.of({pos, on: !hasBreakpoint})
        })
    }

    const breakpointMarker = new class extends GutterMarker {
        toDOM() { return document.createTextNode("💔") }
    }

    const breakpointGutter = [
        breakpointState,
        mygutter({
            class: "cm-breakpoint-gutter",
            markers: v => v.state.field(breakpointState),
            lineMarkerChange: (update) => {
                // TODO: I'd need to be able to use this (?) to update the line everytime it gets updated.
                //  Normally, this works with lineMarker itself - but we cannot use that because we want state and effect
                //  to be able to store the scope there. Though note that we still need to program that also.
                //  But before we do that, we should be able to find which line was updated here - currently I don't find that in the
                //  `update` variable!?
                // console.log('lineMarkerChange', update);
                // toggleBreakpoint(update.view, update.changes.sections[0])
                return true;
            },
            initialSpacer: () => breakpointMarker,
            domEventHandlers: {
                mousedown(view, line) {
                    toggleBreakpoint(view, line.from)
                    return true
                }
            }
        }),
        EditorView.baseTheme({
            ".cm-breakpoint-gutter .cm-gutterElement": {
                color: "red",
                paddingLeft: "5px",
                cursor: "default"
            }
        })
    ]









    const emptyMarker = new class extends GutterMarker {
        toDOM() {
            return document.createTextNode("ø")
        }
    }

    const mathOutputMarker = (result: string) => new class extends GutterMarker {
        // private result: number = result;

        toDOM() {
            return document.createTextNode(result.toString());
        }
    }

    const myEmptyLineGutter = mygutter({
        lineMarker(view, line) {
            return line.from == line.to ? emptyMarker : null
        },
        initialSpacer: () => emptyMarker
    })

    const mathOutputGutter = mygutter({
        lineMarker(view, line) {
            let viewText = view.state.doc.sliceString(line.from, line.to);
            // console.log('line text', viewText);

            let lineNumber = view.state.doc.lineAt(line.from).number;
            // console.log('line number', lineNumber);
            // TODO: Now it works... now I just need context/scope - for that I'll need full markers, I think!
            let result = mathjsEvaluate(viewText, {}).result;
            // console.log('result', result);
            return mathOutputMarker(result);
        },
        initialSpacer: () => emptyMarker
    })

    let editorDiv: HTMLDivElement;


    onMount(() => {
        let editor = new EditorView({
            extensions: [
                [
                    highlightActiveLineGutter(),
                    EditorView.lineWrapping,
                    highlightSpecialChars(),
                    history(),
                    // foldGutter(),
                    // gutter({class: "cm-mygutter"}),
                    // mygutter({class: "cm-mygutter"}),
                    myEmptyLineGutter,
                    mathOutputGutter,
                    breakpointGutter,
                    // lineNumbers(),
                    // myLineNumberGutter,
                    myLineNumbers(),
                    drawSelection(),
                    dropCursor(),
                    EditorState.allowMultipleSelections.of(true),
                    indentOnInput(),
                    syntaxHighlighting(defaultHighlightStyle, {fallback: true}),
                    bracketMatching(),
                    closeBrackets(),
                    autocompletion(),
                    rectangularSelection(),
                    crosshairCursor(),
                    // highlightActiveLine(),
                    highlightSelectionMatches(),
                    keymap.of([
                        ...closeBracketsKeymap,
                        ...defaultKeymap,
                        ...searchKeymap,
                        ...historyKeymap,
                        ...foldKeymap,
                        ...completionKeymap,
                        ...lintKeymap
                    ]),

                    mathOutputPlugin,
                ],
                // javascript()
                example()
            ],
            parent: editorDiv
        });

    })
</script>


<div class="calculator-area">
    <div aria-label="Calculator Textarea" bind:this={editorDiv} class="codemirror"></div>
</div>


<style>
    .codemirror {
        display: contents;
    }
</style>