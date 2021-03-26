<script>
  import * as d3 from 'd3'
  import { green, rem } from '../constants'
  import Table from './Table.svelte'

  let width = 32 * rem
  let height = 15 * rem
  let px = 6 * rem
  let py = 0 * rem

  let table = [
    { id: 'userId', key: 'ID', value: [1, 2], selected: true },
    { id: 'name', key: '姓名', value: ['小明', 'Jane Doe'], selected: true },
    {
      id: 'location',
      key: '地区',
      value: ['北京', 'Ape City'],
      selected: true,
    },
    { id: 'os', key: '设备', value: ['macOS', 'Windows 10'], selected: false },
  ]

  $: filtered = table.filter(d => d.selected)
  $: head = filtered.map(d => d.key)
  $: body = [filtered.map(d => d.value[0]), filtered.map(d => d.value[1])]

  let data = {
    id: 'student',
    children: [
      { id: 'userId' },
      {
        id: 'profile',
        children: [{ id: 'name' }, { id: 'location' }],
      },
      {
        id: 'device',
        children: [{ id: 'os' }],
      },
    ],
  }

  let root = d3.hierarchy(data)
  d3.tree().size([height - 2 * py, width - 2 * px])(root)

  let link = d3
    .linkHorizontal()
    .x(d => d.y)
    .y(d => d.x)

  let route = new Set()
  $: {
    let nodes = root.descendants()
    route = new Set(
      filtered
        .map(c => nodes.find(d => d.data.id == c.id))
        .flatMap(d => d.path(root)),
    )
  }

  $: isUserIdSelected = filtered.find(c => c.id == 'userId')
  $: isNameSelected = filtered.find(c => c.id == 'name')
  $: isLocationSelected = filtered.find(c => c.id == 'location')
  $: isDeviceSelected = filtered.find(c => c.id == 'os')
</script>

<div class="flex">
  <div class="w-24 grid place-content-center">
    <span class="text-sm text-gray-400">UI</span>
  </div>

  <div class="flex-grow grid place-content-center">
    <div class="w-xl flex justify-between items-center space-x-4">
      <div>
        <Table {head} {body} />
      </div>

      <ul>
        {#each table as d}
          {#if d.id != 'userId'}
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
  </div>
</div>

<div class="flex">
  <div class="w-24 grid place-content-center">
    <span class="text-sm text-gray-400">调用方请求</span>
  </div>

  <div class="flex-grow grid place-content-center">
    <svg {width} {height}>
      <g transform={`translate(${px},${py})`}>
        {#each root.links() as d}
          {#if !route.has(d.source) || !route.has(d.target)}
            <path d={link(d)} fill="none" stroke="lightgray" opacity={0.5} />
          {:else}
            <path
              d={link(d)}
              fill="none"
              stroke={green}
              stroke-width={2}
              opacity={0.5}
            />
          {/if}
        {/each}

        {#each root.descendants() as d}
          <g transform={`translate(${d.y},${d.x})`}>
            <circle r={3} fill="gray" />
            <text
              dx={d.children ? '-.5em' : '.5em'}
              dy=".25em"
              fill="gray"
              text-anchor={d.children ? 'end' : 'start'}>{d.data.id}</text
            >
          </g>
        {/each}
      </g>
    </svg>
  </div>
</div>

<div class="flex">
  <div class="w-24 grid place-content-center">
    <span class="text-sm text-gray-400">接口</span>
  </div>

  <div class="h-64 flex-grow grid place-content-center">
    <div class="font-mono text-sm">
      <p>[</p>

      <p class="pl-4">{'{'}</p>
      <p class="pl-8">
        <span class="text-green-600">
          "userId": 1{isNameSelected || isLocationSelected || isDeviceSelected
            ? ','
            : ''}
        </span>
      </p>
      {#if isNameSelected || isLocationSelected}
        <p class="pl-8 text-green-600">
          "profile": {'{'}
          {#if isNameSelected && isLocationSelected}
            "name": "小明", "location": "北京"
          {/if}
          {#if !isNameSelected}
            "location": "北京"
          {/if}
          {#if !isLocationSelected}
            "name": "小明"
          {/if}
          {isDeviceSelected ? '},' : '}'}
        </p>
      {/if}
      {#if isDeviceSelected}
        <p class="pl-8 text-green-600">
          "device": {'{'} "os": "macOS" {'}'}
        </p>
      {/if}
      <p class="pl-4">{'},'}</p>

      <p class="pl-4">{'{'}</p>
      <p class="pl-8">
        <span class="text-green-600">
          "userId": 2{isNameSelected || isLocationSelected || isDeviceSelected
            ? ','
            : ''}
        </span>
      </p>
      {#if isNameSelected || isLocationSelected}
        <p class="pl-8 text-green-600">
          "profile": {'{'}
          {#if isNameSelected && isLocationSelected}
            "name": "Jane Doe", "location": "Ape City"
          {/if}
          {#if !isNameSelected}
            "location": "Ape City"
          {/if}
          {#if !isLocationSelected}
            "name": "Jane Doe"
          {/if}
          {isDeviceSelected ? '},' : '}'}
        </p>
      {/if}
      {#if isDeviceSelected}
        <p class="pl-8 text-green-600">
          "device": {'{'} "os": "Windows 10" {'}'}
        </p>
      {/if}
      <p class="pl-4">{'}'}</p>

      <p>]</p>
    </div>
  </div>
</div>

<div class="flex">
  <div class="w-24 grid place-content-center">
    <span class="text-sm text-gray-400">数据源</span>
  </div>

  <div class="flex-grow grid grid-flow-col place-content-evenly">
    <div class="grid place-content-center">
      <div class="font-mono text-sm">
        <p>[</p>
        <p class="pl-4">
          {'{'}
          <span class:text-green-600={isUserIdSelected}> "userId": 1 </span>
          {'},'}
        </p>
        <p class="pl-4">
          {'{'}
          <span class:text-green-600={isUserIdSelected}> "userId": 2 </span>
          {'}'}
        </p>
        <p>]</p>
      </div>
    </div>

    {#if isNameSelected || isLocationSelected}
      <div class="grid place-content-center">
        <div class="font-mono text-sm">
          <p>{`{`}</p>
          <p class="pl-4">
            <span>1: {`{`}</span>
            <span class:text-green-600={isNameSelected}> "name": "小明", </span>
            <span class:text-green-600={isLocationSelected}>
              "location": "北京"
            </span>
            <span>{`}`},</span>
          </p>
          <p class="pl-4">
            <span>2: {`{`}</span>
            <span class:text-green-600={isNameSelected}>
              "name": "Jane Doe",
            </span>
            <span class:text-green-600={isLocationSelected}>
              "location": "Ape City"
            </span>
            <span>{`}`}</span>
          </p>
          <p class="pl-4">3: ...</p>
          <p>{`}`}</p>
        </div>
      </div>
    {/if}

    {#if isDeviceSelected}
      <div class="grid place-content-center">
        <div class="font-mono text-sm">
          <p>{`{`}</p>
          <p class="pl-4">
            <span>1: {`{`}</span>
            <span class:text-green-600={isDeviceSelected}> "os": "macOS" </span>
            <span>{`}`},</span>
          </p>
          <p class="pl-4">
            <span>2: {`{`}</span>
            <span class:text-green-600={isDeviceSelected}>
              "os": "Windows 10"
            </span>
            <span>{`}`}</span>
          </p>
          <p class="pl-4">3: ...</p>
          <p>{`}`}</p>
        </div>
      </div>
    {/if}
  </div>
</div>
