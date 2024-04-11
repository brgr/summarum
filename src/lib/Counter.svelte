<script lang="ts">
    let textAreaContent = 'x = 2\n\ny = x + 1'; // Default content
    let results: Record<string, string | number> = {};

    function parseTextArea() {
        const lines = textAreaContent.split('\n');
        lines.forEach(line => {
            if (line.includes('=')) {
                const [variable, value] = line.split('=');
                results[variable.trim()] = value.trim();
            }
        });
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
    import { onMount } from 'svelte';
    onMount(() => {
        parseTextArea();
        executeCalculations();
    });
</script>

<textarea bind:value={textAreaContent} />

<button on:click={parseTextArea}>Parse</button>
<button on:click={executeCalculations}>Calculate</button>

<div>
    {#each Object.entries(results) as [variable, value]}
        <p>{variable}: {value}</p>
    {/each}
</div>

<style>
    textarea {
        width: 100%;
        height: 100px;
        font-family: monospace;
        font-size: 16px;
    }
</style>