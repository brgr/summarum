<script lang="ts">
    import {EditorView, basicSetup} from "codemirror"
    import {javascript} from "@codemirror/lang-javascript"
    import {onMount} from "svelte";
    import {
        crosshairCursor,
        drawSelection,
        dropCursor, highlightActiveLine,
        highlightActiveLineGutter,
        highlightSpecialChars, keymap,
        lineNumbers, rectangularSelection
    } from "@codemirror/view";
    import {defaultKeymap, history, historyKeymap} from "@codemirror/commands";
    import {
        bracketMatching,
        defaultHighlightStyle,
        foldGutter, foldKeymap,
        indentOnInput,
        syntaxHighlighting
    } from "@codemirror/language";
    import {EditorState} from "@codemirror/state";
    import {autocompletion, closeBrackets, closeBracketsKeymap, completionKeymap} from "@codemirror/autocomplete";
    import {highlightSelectionMatches, searchKeymap} from "@codemirror/search";
    import {lintKeymap} from "@codemirror/lint";
    import {mathOutputPlugin} from "./math_output_widget_decorator";
    import {example} from "./mathjs_lezer";


    let editorDiv: HTMLDivElement;


    onMount(() => {
        let editor = new EditorView({
            extensions: [
                [
                    // lineNumbers(),
                    highlightActiveLineGutter(),
                    EditorView.lineWrapping,
                    highlightSpecialChars(),
                    history(),
                    // foldGutter(),
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


<div class="calculator-area" >
    <div bind:this={editorDiv} class="codemirror" aria-label="Calculator Textarea"></div>
</div>


<style>
    .codemirror {
        display: contents;
    }
</style>