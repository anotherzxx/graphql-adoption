<script>
  import * as d3 from 'd3';
  import { onMount } from 'svelte';
  import { rem } from '../constants';
  import { parse,pick,restData } from '../data';


  let width = 70 * rem
  let height = 35 * rem
  let px = 4 * rem
  let py = 2 * rem

  let svgRef

  let options = [
    { key: 'P99', value: 0.99 },
    { key: 'P95', value: 0.95 },
    { key: 'P90', value: 0.9 },
    { key: 'P75', value: 0.75 },
  ]

  let selected = options[1]

  let rawData = []

  $: data = d3
    .groups(rawData, r => d3.timeMinute(new Date(r.startTime)))
    .map(([_, raw]) => pick(raw, selected.value))
    .map(parse)

  $: contentKeys = data[0]?.contents?.map(c => c.key) ?? []

  $: color = d3
    .scaleOrdinal()
    .domain(contentKeys)
    .range(d3.schemeSpectral[contentKeys.length] ?? [])
    .unknown('#ccc')

  $: series = d3
    .stack()
    .keys(contentKeys)
    .value((d, key) => d.contents.find(c => c.key == key).elapsedMillis)(data)

  $: xScale = d3
    .scaleBand()
    .domain(data.map(d => d.startTime))
    .range([px, width - px])
    .padding(0.1)

  let yScale = d3
    .scaleLinear()
    .domain([0, 3_000])
    .range([height - py, py])
    .clamp(true)

  $: {
    let svg = d3.select(svgRef)

    svg
      .select('.xAxis')
      .call(g => g.selectChildren().remove())
      .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat('%Y-%m-%d %H:%M')))
      .call(g => g.select('.domain').remove())
      .call(g =>
        g
          .selectAll('.tick')
          .filter((_, i) => i % Math.floor(data.length / 8) != 0)
          .remove(),
      )
      .call(g =>
        g
          .selectAll('text')
          .filter((_, i) => i % 2 != 0)
          .remove(),
      )
      .call(g => g.select('.tick').remove())

    svg
      .select('.yAxis')
      .call(g => g.selectChildren().remove())
      .call(
        d3
          .axisRight(yScale)
          .tickSize(width - 2 * px)
          .tickFormat(function (d) {
            return d + (this.parentNode?.nextSibling ? '' : ' ms')
          }),
      )
      .call(g => g.select('.domain').remove())
      .call(g =>
        g
          .selectAll('.tick:not(:first-of-type) line')
          .attr('stroke-opacity', 0.5)
          .attr('stroke-dasharray', '2,2'),
      )
      .call(g => g.selectAll('text').attr('dx', 4))
  }

  onMount(() => {
    restData.then(_ => (rawData = _))
  })
</script>

<section class="my-8">
  <div
    class="mx-auto flex justify-end"
    style={`width: ${width}px; padding-right: ${px}px`}
  >
    <select bind:value={selected} class="p-0.5 text-sm border rounded">
      {#each options as opt}
        <option value={opt}>{opt.key}</option>
      {/each}
    </select>
  </div>

  <svg bind:this={svgRef} {width} {height} class="mx-auto">
    <g class="xAxis" transform={`translate(0,${height - py})`} />
    <g class="yAxis" transform={`translate(${px},0)`} />
    <g>
      {#each series as s}
        <g fill={color(s.key)}>
          {#each s as d}
            <rect
              x={xScale(d.data.startTime)}
              y={yScale(d[1])}
              width={xScale.bandwidth()}
              height={yScale(d[0]) - yScale(d[1])}
            />
          {/each}
        </g>
      {/each}
    </g>
    <g transform={`translate(${px + 20},20) scale(0.8)`}>
      {#each contentKeys as d, i}
        <g transform={`translate(0, ${i * 20})`}>
          <rect width={10} height={10} fill={color(d)} />
          <text dx={20} dy="0.7em">{d}</text>
        </g>
      {/each}
    </g>
  </svg>
</section>
