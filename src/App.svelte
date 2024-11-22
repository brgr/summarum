<script lang="ts">
    import CalculatorTextarea from "./lib/CalculatorTextarea.svelte";

    let calculatorTextarea: CalculatorTextarea;

    // on focus, give focus to CalculatorTextarea
    window.addEventListener('focus', () => {
        calculatorTextarea.focus();
    })
</script>

<main>

    <div class="card">
        <CalculatorTextarea bind:this={calculatorTextarea} />
    </div>

</main>
