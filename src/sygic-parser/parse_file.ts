import fs = require('fs')
import { buildGPX, GarminBuilder } from 'gpx-builder'

import GarminPoint from 'gpx-builder/dist/builder/GarminBuilder/models/GarminPoint'
import { SygicLogEntryInterface } from './types'
import { SygicLogEntry } from './sygic_log_entry'

const { Point, Metadata } = GarminBuilder.MODELS

export const parseFile = (name: string, file: Buffer): string => {
  const sygicLogEntry: SygicLogEntryInterface = new SygicLogEntry(file)
  sygicLogEntry.parseHeader()
  sygicLogEntry.setStartTime()
  sygicLogEntry.parsePoints()

  console.log(sygicLogEntry.arr)
  console.log(sygicLogEntry.header)
  console.log(sygicLogEntry.points[0])

  const gpxData = new GarminBuilder()
  const gpxPoints: GarminPoint[] = sygicLogEntry.points.map(
    (point) =>
      new Point(point.lat ?? 0, point.lon ?? 0, {
        ele: point.smoothedElevation ?? point.elevation,
        time: new Date(sygicLogEntry.startTime.valueOf() + (point.time ?? 0)),
        speed: point.smoothedSpeed ?? point.speed,
      })
  )
  const meta = new Metadata({
    name: sygicLogEntry.header.startDescription + ' - ' + sygicLogEntry.header.endDescription,
    time: sygicLogEntry.startTime,
  })

  gpxData.setMetadata(meta)
  gpxData.setSegmentPoints(gpxPoints)

  const gpx = buildGPX(gpxData.toObject())

  fs.writeFileSync(`./${name}.gpx`, gpx)
  return gpx
}
