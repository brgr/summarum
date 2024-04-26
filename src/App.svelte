<script lang="ts">
  import Counter from './lib/CalculatorTextarea.svelte'
</script>

<main>
  <h1>
<!--    Summa Summarum-->
    summarum
  </h1>

  <div class="card">
    <Counter />
  </div>

  <p>I should link to the docs here.</p>

  <p class="read-the-docs">
    Maybe some more text.
  </p>
</main>

<style>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
  .read-the-docs {
    color: #888;
  }
</style>
