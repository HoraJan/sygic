export enum StructureType {
  int = 'int',
  string = 'string',
  float = 'float',
  utf16 = 'utf16',
}

export enum NumberHeaderField {
  favorite = 'favorite',
  type = 'type',
  duration = 'duration',
  distance = 'distance',
  segmentDistance = 'segmentDistance',
  endLon = 'endLon',
  endLat = 'endLat',
  pointCount = 'pointCount',
}

export enum StringHeaderField {
  header = 'header',
  startDescription = 'startDescription',
  endDescription = 'endDescription',
  startTime = 'startTime',
  destination = 'destination',
}

export enum SygicPointField {
  lon = 'lon',
  lat = 'lat',
  elevation = 'elevation',
  time = 'time',
  speed = 'speed',
  signalQuality = 'signalQuality',
  speeding = 'speeding',
  gsmSignalQuality = 'gsmSignalQuality',
  internetSignalQuality = 'internetSignalQuality',
  batteryStatus = 'batteryStatus',
}

export interface StructurePoint {
  type: StructureType
  length?: number
  delimiter?: number
  add?: number
  parseFunction: (field: StructurePoint, logEntry: SygicLogEntryInterface) => string | number
}

export interface HeaderStructurePoint extends StructurePoint {
  name: NumberHeaderField | StringHeaderField
}

export interface SygicPointStructurePoint extends StructurePoint {
  name: SygicPointField
}

export type Header = {
  [K in NumberHeaderField]?: number
} &
  {
    [K in StringHeaderField]?: string
  }

export type SygicPoint = {
  [K in SygicPointField]?: number
} & {
  smoothedElevation?: number
  smoothedSpeed?: number
}

export interface SygicLogEntryInterface {
  index: number
  arr: number[]
  header: Header
  points: SygicPoint[]
  simplifiedPoints: SygicPoint[]
  startTime: Date
  parseHeader: () => void
  setStartTime: () => void
  parsePoints: () => void
  smoothElevation: (length?: number) => void
  smoothSpeed: (length?: number) => void
  simplify: (toelrance?: number) => void
}
