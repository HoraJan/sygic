import fs = require('fs')
import { GarminBuilder } from 'gpx-builder'

// import { GarminPoint, Person } from 'gpx-builder'
import { SygicLogEntryInterface } from './types'
import { SygicLogEntry } from './sygic_log_entry'
import GarminPoint from 'gpx-builder/dist/builder/GarminBuilder/models/GarminPoint'
import { Person } from 'gpx-builder/dist/builder/BaseBuilder/models'

const { Point, Metadata } = GarminBuilder.MODELS

export const parseFile = (
  name: string,
  file: Buffer,
  cleaningFactor?: number,
  author?: string
): { meta: any; gpxPoints: GarminPoint[] } => {
  fs.writeFileSync(`./logs/${name}.log`, file)

  const sygicLogEntry: SygicLogEntryInterface = new SygicLogEntry(file)
  sygicLogEntry.parseHeader()
  sygicLogEntry.setStartTime()
  sygicLogEntry.parsePoints()

  if (cleaningFactor) sygicLogEntry.simplify(cleaningFactor)

  sygicLogEntry.smoothElevation()
  sygicLogEntry.smoothSpeed()

  console.log(sygicLogEntry.header)
  console.log(
    sygicLogEntry.points.length,
    ` -> by (${cleaningFactor}) `,
    sygicLogEntry.simplifiedPoints.length
  )

  const points = cleaningFactor ? sygicLogEntry.simplifiedPoints : sygicLogEntry.points

  const gpxPoints: GarminPoint[] = points.map(
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
    desc: `${(sygicLogEntry.header.distance ?? 0) / 1000} km drive`,
    author: new Person({ name: author }),
  })

  // const segment = new Segment(gpxPoints)
  // const track = new Track([segment])
  // gpxData.setTracks([track])

  // const gpx = buildGPX(gpxData.toObject())

  return { meta, gpxPoints }
}
