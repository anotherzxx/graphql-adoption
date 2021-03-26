<script>
  import * as d3 from 'd3'
  import { rem } from '../constants'

  export let width
  export let height
  export let px = 6 * rem
  export let py = 0 * rem

  export let data

  let root = d3.hierarchy(data)
  d3.tree().size([height - 2 * py, width - 2 * px])(root)

  let link = d3
    .linkHorizontal()
    .x(d => d.y)
    .y(d => d.x)
</script>

<svg {width} {height}>
  <g transform={`translate(${px},${py})`}>
    {#each root.links() as d}
      <path d={link(d)} fill="none" stroke="lightgray" opacity={0.5} />
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
