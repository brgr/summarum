<script lang="ts">
    import {parseTextAreaContent} from "./parser";
    import {mathjsEvaluate} from "./eval";

    import {updateEditor} from "./editor_stuff";

    let calculatorEditorWasEmpty = true;
    let calculatorEditorInnerHtml = '';

    let calculatorOutput = '';
    let statements: string[];
    let results: number[];

    function editorInputHandler(event: Event) {
        // const target = event.target as HTMLElement;
        // calculatorEditorInnerHtml = target.innerHTML;
        updateEditor(event.target);
    }

    $: {
        // console.log('textAreaContent:', calculatorEditorInnerHtml);
        //
        // if (calculatorEditorInnerHtml === '') { // TODO: Maybe also check for when we have elements inside, but they are all empty?
        //     calculatorOutput = '';
        //     calculatorEditorWasEmpty = true;
        // } else {
        //
        //     if (calculatorEditorWasEmpty) {
        //         calculatorEditorInnerHtml = `<span class="calculator-editor-line">${calculatorEditorInnerHtml}</span>`;
        //     }
        //
        //     calculatorEditorWasEmpty = false;
        //
        //     statements = parseTextAreaContent(calculatorEditorInnerHtml);
        //     console.log('statements:', statements);
        //     results = mathjsEvaluate(statements);
        //     console.log('results:', results);
        //
        //     calculatorOutput = results.map((result) => {
        //         return `<span class="calculator-result" contenteditable="false">${result ? result : ''}</span>`;
        //     }).join('<br />');
        // }
    }
</script>

<div class="calculator-area">
    <div bind:innerHTML={calculatorEditorInnerHtml} on:input={editorInputHandler} class="calculator-textarea" contenteditable/>
    <div class="calculator-output">{@html calculatorOutput}</div>
</div>

<style>
    .calculator-area {
        padding: 0.5em;
        margin-bottom: 2em;
        text-align: left;

        /* The two divs inside should be side by side. The left div should take more space */
        display: flex;
        align-items: stretch;
    }

    .calculator-textarea:focus-visible {
        /* TODO: I want to have this on the calculator-area instead - how do I do that? */
        outline: none;
    }

    .calculator-textarea {
        width: 80%;

        font-size: 1.05em;

        white-space: pre-wrap;
        word-wrap: break-word;
        overflow-wrap: break-word;
    }

    .calculator-output {
        width: 20%;

        font-size: 1.05em;
    }

    /* We need to make this global s.t. the svelte compiler keeps it, since at first this class doesn't exist. */
    :global(.calculator-result) {
        color: #007bff;
        float: right;

        font-weight: bold;
        padding-right: .2em;
    }
</style>