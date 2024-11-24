<script lang="ts">
    import CalculatorTextarea from "./lib/CalculatorTextarea.svelte";

    const version = PKG_VERSION;

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

    <div class="version-notice">
        v{version}
    </div>

</main>

<style>
    main {
        display: flex;
        justify-content: center;
        width: 100%;
        margin: 0 auto;
    }

    .card {
        width: 100%;
    }

    .version-notice {
        position: fixed;
        bottom: .2em;
        right: .5rem;
        font-size: .8em;
        color: #666;
    }
</style>
