<script lang="ts">
    import {type CalculatorStatement, expressionToString, parseTextArea} from "./parser";
    import {onMount} from 'svelte';
    import {type CalculatorResult, executeCalculations} from "./eval";

    let textAreaContent = 'x = 2\n\ny = x + 1'.replace(/\n/g, '<br>');
    let statements: CalculatorStatement[] = [];
    let results: CalculatorResult[] = [];

    function myParse() {
        statements = parseTextArea(textAreaContent);
    }

    let variables: Record<string, number> = {};

    function myCalculate() {
        results = executeCalculations(statements, variables);
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
        {#if Array.isArray(statement)}
<!--            <p>{statement[0]}-->
<!--                : {expressionToString(statement[1])} {results[index] !== undefined ? `= ${results[index][1]}` : ''}</p>-->
            <p>
                {statement[0]}: {expressionToString(statement[1])}
                {results[index] !== undefined ? `= ${results[index]}` : ''}
            </p>
        {:else}
            <p>{expressionToString(statement)} {results[index] !== undefined ? `= ${results[index]}` : ''}</p>
        {/if}
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