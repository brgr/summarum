<script lang="ts">
    import {type CalculatorStatement, type Expression, expressionToString, parseTextArea} from "./parser";

    let textAreaContent = 'x = 2\n\ny = x + 1'.replace(/\n/g, '<br>');
    let results: CalculatorStatement[] = [];

    function myParse() {
        results = parseTextArea(textAreaContent);
    }

    function evaluateExpression(expression: Expression, variables: Record<string, number> = {}): number{
        if (expression.kind === 'Number') {
            return expression.value;
        } else if (expression.kind === 'Variable') {
            return variables[expression.name] ?? NaN;
        } else if (expression.kind === 'Sum') {
            return expression.elements.reduce((sum, expr) => sum + evaluateExpression(expr), 0);
        } else if (expression.kind === 'Product') {
            return expression.factors.reduce((product, expr) => product * evaluateExpression(expr), 1);
        }
        throw new Error(`Invalid expression: ${JSON.stringify(expression)}`);
    }

    const variables: Record<string, number> = {};

    function executeCalculations() {
        for (let i = 0; i < results.length; i++) {
            const statement = results[i];
            if (Array.isArray(statement)) {
                const [variable, expression] = statement;
                const result = evaluateExpression(expression, variables);
                variables[variable] = result;
                results[i] = [variable, { kind: 'Number', value: result }];
            } else {
                const result = evaluateExpression(statement, variables);
                results[i] = { kind: 'Number', value: result };
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
    {#each results as statement}
        {#if Array.isArray(statement)}
            <p>{statement[0]}: {expressionToString(statement[1])}</p>
        {:else}
            <p>{expressionToString(statement)}</p>
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