<script lang="ts">
    import {EditorView} from "codemirror"
    import {onMount} from "svelte";
    import {
        crosshairCursor,
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
    import {example} from "./mathjs_lezer";
    import {mathResults} from "./output_math_gutter";

    let editorDiv: HTMLDivElement;

    onMount(() => {
        let editor = new EditorView({
            extensions: [
                [
                    highlightActiveLineGutter(),
                    EditorView.lineWrapping,
                    highlightSpecialChars(),
                    history(),

                    mathResults(),

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