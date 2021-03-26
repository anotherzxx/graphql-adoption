<script>
  import Table from './Table.svelte';


  let table = [
    { key: 'ID', value: [1, 2], selected: true },
    { key: '姓名', value: ['小明', 'Jane Doe'], selected: true },
    { key: '地区', value: ['北京', 'Ape City'], selected: true },
    { key: '设备', value: ['macOS', 'Windows 10'], selected: true },
    { key: '年级', value: ['三年级', '五年级'], selected: false },
    { key: '备注', value: ['🎉', '-'], selected: false },
    { key: '...', value: ['...', '...'], selected: true },
  ]

  $: filtered = table.filter(d => d.selected)
  $: head = filtered.map(d => d.key)
  $: body = [filtered.map(d => d.value[0]), filtered.map(d => d.value[1])]
</script>

<div class="flex justify-between items-center space-x-4">
  <div>
    <Table {head} {body} />
  </div>

  <ul>
    {#each table as d}
      {#if d.key != 'ID' && d.key != '...'}
        <li>
          <label>
            <input type="checkbox" bind:checked={d.selected} />
            {d.key}
          </label>
        </li>
      {/if}
    {/each}
  </ul>
</div>
