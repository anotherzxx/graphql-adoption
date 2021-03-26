<script lang="ts">
  export let head: string[]
  export let body: string[][]
</script>

<table class="mx-auto divide-y">
  <thead class="text-left">
    <tr>
      {#each head as d}
        <th class="px-4 py-2">{d}</th>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each body as r}
      <tr>
        {#each r as d}
          <td class="px-4 py-2">{d}</td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>
