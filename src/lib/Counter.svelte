<script lang="ts">
    import {parseTextAreaContent} from "./parser";
    import {mathjsEvaluate} from "./eval";

    let textAreaContent = 'x = 2\n\ny = x + 1'.replace(/\n/g, '<br>');
    let statements: string[];
    let results: number[];

    $: {
        statements = parseTextAreaContent(textAreaContent);
        results = mathjsEvaluate(statements);
    }
</script>

<div bind:innerHTML={textAreaContent} contenteditable/>

<div>
    {#each statements as statement, index}
        <p>
            {statement} = {results && results[index] ? results[index] : 'N/A'}
        </p>
    {/each}
</div>

<style>
    [contenteditable] {
        padding: 0.5em;
        margin-bottom: 2em;
        border: 1px solid #eee;
        border-radius: 4px;
        text-align: left;
    }
</style>