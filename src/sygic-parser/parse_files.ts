import fs = require('fs')
import { buildGPX, GarminBuilder } from 'gpx-builder'

import { UploadedFile } from 'express-fileupload'
import { parseFile } from './parse_file'

const { Track, Segment } = GarminBuilder.MODELS

export const parseFiles = (
  files: UploadedFile[],
  cleaningFactor?: number,
  author?: string
): { name: string; gpx: string } => {
  let meta: any
  let name = ''
  const gpxData = new GarminBuilder()

  const segment = files.map((file, index) => {
    const [fileName] = file.name?.split('.')
    const fileContent = file.data

    const gpxPoints = parseFile(fileName, fileContent, cleaningFactor, author)

    if (index === 0) {
      meta = gpxPoints.meta
      name = fileName
    }
    return new Segment(gpxPoints.gpxPoints)
  })

  gpxData.setMetadata(meta)

  const track = new Track(segment)
  gpxData.setTracks([track])

  const gpx = buildGPX(gpxData.toObject())

  fs.writeFileSync(`./${name}.gpx`, gpx)
  return { gpx, name: name + '-' + Math.random().toString(36).substring(6) }
}
