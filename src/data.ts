import * as d3 from 'd3'
// @ts-ignore
import graphqlUrl from '../assets/graphql.json?url'
// @ts-ignore
import restUrl from '../assets/rest.json?url'

export let restData = fetch(restUrl).then<RawRecord[]>(r => r.json())
export let graphqlData = fetch(graphqlUrl).then<RawRecord[]>(r => r.json())

export interface RawRecord {
  id: number
  joinPoint: string
  startTime: number
  endTime: number
  contents: Content[]
}

export interface Content {
  createdTime: number
  type: string
  payload: string
}

export interface ParsedRecord {
  id: number
  startTime: Date
  elapsedMillis: number
  contents: ParsedContent[]
}

export interface ParsedContent {
  key: string
  elapsedMillis: number
}

export let pick = (raw: RawRecord[], p: number) => {
  let i = Math.ceil(d3.interpolate(0, raw.length - 1)(p))
  return d3.sort(raw, r => r.endTime - r.startTime)[i]
}

export let parse = ({
  id,
  startTime,
  endTime,
  contents,
}: RawRecord): ParsedRecord => {
  let parsedContents = contents.map((content, i) => ({
    key: content.type + ':' + content.payload,
    elapsedMillis:
      content.createdTime - (contents[i - 1]?.createdTime ?? startTime),
  }))

  return {
    id,
    startTime: d3.timeMinute(new Date(startTime)),
    elapsedMillis: endTime - startTime,
    contents: parsedContents,
  }
}
