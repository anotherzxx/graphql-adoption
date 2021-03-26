<script>
  import * as d3 from 'd3'
  import { onMount } from 'svelte'
  import { rem } from '../constants'
  import { graphqlData, parse, pick, restData } from '../data'

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

  let rawRest = []
  let rawGraphql = []

  $: dataRest = d3
    .groups(rawRest, r => d3.timeMinute(new Date(r.startTime)))
    .map(([_, raw]) => pick(raw, selected.value))
    .map(parse)

  $: dataGraphql = d3
    .groups(rawGraphql, r => d3.timeMinute(new Date(r.startTime)))
    .map(([_, raw]) => pick(raw, selected.value))
    .map(parse)

  $: xScaleRest = d3
    .scaleBand()
    .domain(dataRest.map(d => d.startTime))
    .range([px, width - px])
    .padding(0.1)

  $: xScaleGraphql = d3
    .scaleBand()
    .domain(dataGraphql.map(d => d.startTime))
    .range([px, width - px])
    .padding(0.1)

  let yScale = d3
    .scaleLinear()
    .domain([0, 3_000])
    .range([height - py, py])
    .clamp(true)

  $: lineRest = d3
    .line()
    .x(d => xScaleRest(d.startTime))
    .y(d => yScale(d.elapsedMillis))
    .curve(d3.curveCardinal)

  $: areaRest = d3
    .area()
    .x(d => xScaleRest(d.startTime))
    .y1(d => yScale(d.elapsedMillis))
    .y0(_ => yScale(0))
    .curve(d3.curveCardinal)

  $: lineGraphql = d3
    .line()
    .x(d => xScaleGraphql(d.startTime))
    .y(d => yScale(d.elapsedMillis))
    .curve(d3.curveCardinal)

  $: areaGraphql = d3
    .area()
    .x(d => xScaleGraphql(d.startTime))
    .y1(d => yScale(d.elapsedMillis))
    .y0(_ => yScale(0))
    .curve(d3.curveCardinal)

  $: {
    let svg = d3.select(svgRef)

    svg
      .select('.xAxis')
      .call(g => g.selectChildren().remove())
      .call(d3.axisBottom(xScaleRest).tickFormat(d3.timeFormat('%H:%M')))
      .call(g => g.select('.domain').remove())
      .call(g =>
        g
          .selectAll('.tick')
          .filter((_, i) => i % Math.floor(dataRest.length / 8) != 0)
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

  let legends = [
    { name: 'REST 2021.02.21 18:00-20:00', color: d3.schemeTableau10[0] },
    { name: 'GraphQL 2021.03.21 18:00-20:00', color: d3.schemeTableau10[1] },
  ]

  onMount(() => {
    restData.then(_ => (rawRest = _))
    graphqlData.then(_ => (rawGraphql = _))
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
      <path d={areaRest(dataRest)} fill={d3.schemeTableau10[0]} opacity={0.1} />
      <path
        d={lineRest(dataRest)}
        fill="none"
        stroke={d3.schemeTableau10[0]}
        opacity={0.8}
      />
      <path
        d={lineGraphql(dataGraphql)}
        fill="none"
        stroke={d3.schemeTableau10[1]}
        opacity={0.8}
      />
      <path
        d={areaGraphql(dataGraphql)}
        fill={d3.schemeTableau10[1]}
        opacity={0.1}
      />
    </g>
    <g transform={`translate(${px + 20},20) scale(0.8)`} opacity={0.8}>
      {#each legends as d, i}
        <g transform={`translate(0, ${i * 20})`}>
          <rect width={10} height={10} fill={d.color} />
          <text dx={20} dy="0.7em">{d.name}</text>
        </g>
      {/each}
    </g>
  </svg>
</section>
