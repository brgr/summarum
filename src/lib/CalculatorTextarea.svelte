<script lang="ts">
    import {parseTextAreaContent} from "./parser";
    import {mathjsEvaluate} from "./eval";

    let textAreaContent = '<div>x = 2</div><div>y = 3</div><div>z = x + y</div>';
    let calculatorOutput = '';
    let statements: string[];
    let results: number[];

    $: {
        statements = parseTextAreaContent(textAreaContent);
        results = mathjsEvaluate(statements);

        calculatorOutput = results.map((result) => {
            return `<span class="calculator-result" contenteditable="false">${result ? result : ''}</span>`;
        }).join('<br />');
    }
</script>

<div class="calculator-area">
    <div bind:innerHTML={textAreaContent} class="calculator-textarea" contenteditable/>
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