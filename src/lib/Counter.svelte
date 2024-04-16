<script lang="ts">
    import {cleanTextAreContent} from "./parser";
    import {onMount} from 'svelte';
    import {mathjsEvaluate} from "./eval";

    let textAreaContent = 'x = 2\n\ny = x + 1'.replace(/\n/g, '<br>');
    let statements: string[] = [];
    let results: number[] = [];

    function myParse() {
        statements = cleanTextAreContent(textAreaContent);
    }

    let variables: Record<string, number> = {};

    function myCalculate() {
        // results = executeCalculations(statements, variables);
        results = mathjsEvaluate(statements);
    }

    onMount(() => {
        myParse()
        myCalculate()
    });
</script>

<div bind:innerHTML={textAreaContent} contenteditable/>

<button on:click={myParse}>Parse</button>
<button on:click={myCalculate}>Calculate</button>

<div>
    {#each statements as statement, index}
        <p>
            {statement} = {results[index]}
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