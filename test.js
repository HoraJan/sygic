const fs = require('fs')
const { buildGPX, GarminBuilder } = require('gpx-builder')
const { Point, Metadata, Track, Segment, Person } = GarminBuilder.MODELS

const file = fs.readFileSync('./gps.data')

const arr = [...file]

const pointsNum = arr.length / 8 / 8

const result = []

for (let pointIndex = 0; pointIndex < pointsNum; pointIndex++) {
  const point = []
  for (let valueIndex = 0; valueIndex < 8; valueIndex++) {
    const buf = new ArrayBuffer(8)
    const view = new DataView(buf)
    const raw = arr.slice(pointIndex * 64 + valueIndex * 8, pointIndex * 64 + valueIndex * 8 + 8)

    const reversed = [...raw].reverse()

    reversed.forEach((b, i) => {
      view.setUint8(i, b)
    })

    const num = view.getFloat64(0)

    point[valueIndex] = num
  }

  console.log(point.join(','))
  result[pointIndex] = point
}

const gpxPoints = result.map(
  (point) =>
    new Point(point[1] ?? 0, point[2] ?? 0, {
      ele: point[7],
      time: new Date(point[0] * 1000),
      speed: point[3],
    })
)

const meta = new Metadata({
  name: 'test',
  time: new Date(result[0][0]).toISOString,
  desc: `drive`,
  author: new Person({ name: 'me' }),
})

const gpxData = new GarminBuilder()

const segments = [new Segment(gpxPoints)]

gpxData.setMetadata(meta)

const track = new Track(segments)
gpxData.setTracks([track])

const gpx = buildGPX(gpxData.toObject())

fs.writeFileSync('./result.gpx', gpx)
