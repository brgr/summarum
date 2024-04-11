<script lang="ts">
    import {parseTextArea} from "./parser";

    let textAreaContent = 'x = 2\n\ny = x + 1'.replace(/\n/g, '<br>');
    let results: Record<string, string | number> = {};

    function myParse() {
        results = parseTextArea(textAreaContent);
    }

    function evaluateExpression(expression: string): number {
        if (!isNaN(Number(expression))) {
            return Number(expression);
        } else if (results.hasOwnProperty(expression)) {
            if (typeof results[expression] === 'number') {
                return results[expression] as number;
            } else {
                return evaluateExpression(results[expression] as string);
            }
        } else if (expression.includes('+')) {
            const parts = expression.split('+').map(part => part.trim());
            return evaluateExpression(parts[0]) + evaluateExpression(parts[1]);
        }
        throw new Error(`Invalid expression: ${expression}`);
    }

    function executeCalculations() {
        for (let variable in results) {
            if (typeof results[variable] === 'string') {
                results[variable] = evaluateExpression(results[variable] as string);
            } else {
                results[variable] = results[variable] as number;
            }
        }
    }

    // Call the functions when the component is mounted
    import {onMount} from 'svelte';

    onMount(() => {
        myParse()
        executeCalculations();
    });
</script>

<div bind:innerHTML={textAreaContent} contenteditable/>

<button on:click={myParse}>Parse</button>
<button on:click={executeCalculations}>Calculate</button>

<div>
    {#each Object.entries(results) as [variable, value]}
        <p>{variable}: {value}</p>
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