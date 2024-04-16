<script lang="ts">
    import {parseTextAreaContent} from "./parser";
    import {mathjsEvaluate} from "./eval";

    let textAreaContent = 'x = 2<span class="calculator-result" contenteditable="false">2</span><br /><br />y = x + 1<span class="calculator-result" contenteditable="false">3</span>';
    let statements: string[];
    let results: number[];

    // TODO: This all works fairly well now. However, since I'm replacing the textAreaContent, the cursor position is lost.
    //  I need to find a way to keep the cursor position.
    // Probably this can help: https://svelte.dev/repl/2c36ef2a63d744038d50efd7bec2b6fb?version=4.2.14

    $: {
        statements = parseTextAreaContent(textAreaContent);
        results = mathjsEvaluate(statements);
        textAreaContent = statements.map((statement, index) => {
            return statement + `<span class="calculator-result" contenteditable="false">${results && results[index] ? results[index] : 'N/A'}</span>`;
        }).join('<br /><br />');
    }
</script>

<div bind:innerHTML={textAreaContent} class="calculator-textarea" contenteditable/>

<style>
    [contenteditable] {
        padding: 0.5em;
        margin-bottom: 2em;
        border: 1px solid #eee;
        border-radius: 4px;
        text-align: left;
    }

    .calculator-textarea {
        max-width: 20em;
        min-width: 14em;
        margin: 0 auto;

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