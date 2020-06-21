import { SygicLogEntryInterface, Header, SygicPoint } from './types'
import { headerStructure } from './utils/header_structure'
import { pointStructure } from './utils/point_structure'
import { ma } from 'moving-averages'
import * as simplifier from 'simplify-geometry'

export class SygicLogEntry implements SygicLogEntryInterface {
  arr: number[]
  index: number = 0
  header: Header = {}
  points: SygicPoint[] = []
  simplifiedPoints: SygicPoint[] = []
  startTime: Date = new Date()

  constructor(fileBuffer: Buffer) {
    this.arr = [...fileBuffer]
  }

  parseHeader() {
    headerStructure.forEach((field) => {
      this.header[field.name] = field.parseFunction(field, this) as any
    })
  }

  setStartTime() {
    const startTimeString = this.header.startTime ?? name
    this.startTime.setFullYear(2000 + parseInt(startTimeString.slice(0, 2), 10))
    this.startTime.setMonth(parseInt(startTimeString.slice(2, 4), 10) - 1)
    this.startTime.setDate(parseInt(startTimeString.slice(4, 6), 10))
    this.startTime.setUTCHours(parseInt(startTimeString.slice(7, 9), 10))
    this.startTime.setUTCMinutes(parseInt(startTimeString.slice(9, 11), 10))
    this.startTime.setUTCSeconds(parseInt(startTimeString.slice(11, 13), 10))
    this.startTime.setMilliseconds(0)
  }

  parsePoints() {
    const pointsNum = this.header.pointCount ?? 0

    for (let i = 0; i < pointsNum; i++) {
      const point = {} as SygicPoint
      pointStructure.forEach((field) => {
        point[field.name] = field.parseFunction(field, this) as any
      })
      this.points.push(point)
    }
  }

  smoothElevation(length = 50) {
    const rawElevation = this.points.map((point: SygicPoint) => point.elevation ?? 0)
    const elevation = ma(rawElevation, length)

    this.points.forEach((point, index) => {
      point.smoothedElevation = elevation[index]
    })
  }

  smoothSpeed(length = 50) {
    const rawSpeed = this.points.map((point: SygicPoint) => point.speed ?? 0)
    const speed = ma(rawSpeed, length)

    this.points.forEach((point, index) => {
      point.smoothedSpeed = speed[index]
    })
  }

  simplify(tolerance: number) {
    const simplified = simplifier(
      this.points.map((point) => [point.lat ?? 0, point.lon ?? 0]),
      tolerance
    )

    this.simplifiedPoints = simplified
      .map((point) => {
        const [lat, lon] = point
        return this.points.filter((orig) => orig.lat === lat && orig.lon === lon)[0]
      })
      .filter(Boolean)
  }
}
