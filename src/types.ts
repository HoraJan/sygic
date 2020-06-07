export enum StructureType {
  int = "int",
  string = "string",
  float = "float",
  byte = "byte",
  utf16 = "utf16",
}

export enum NumberHeaderField {
  favorite = "favorite",
  type = "type",
  duration = "duration",
  distance = "distance",
  segmentDistance = "segmentDistance",
  endLon = "endLon",
  endLat = "endLat",
  pointCount = "pointCount",
}

export enum StringHeaderField {
  header = "header",
  startDescription = "startDescription",
  endDescription = "endDescription",
  startTime = "startTime",
  destination = "destination",
}

export enum SygicPointField {
  lon = "lon",
  lat = "lat",
  elevation = "elevation",
  time = "time",
  speed = "speed",
  signalQuality = "signalQuality",
  speeding = "speeding",
  gsmSignalQuality = "gsmSignalQuality",
  internetSignalQuality = "internetSignalQuality",
  batteryStatus = "batteryStatus",
}

export interface StructurePoint {
  type: StructureType;
  length?: number;
  delimiter?: number;
  add?: number;
}

export interface HeaderStructurePoint extends StructurePoint {
  name: NumberHeaderField | StringHeaderField;
}

export interface SygicPointStructurePoint extends StructurePoint {
  name: SygicPointField;
}

export type Header = {
  [K in NumberHeaderField]: number;
} &
  {
    [K in StringHeaderField]: string;
  };

export type SygicPoint = {
  [K in SygicPointField]: number;
};

export interface HeaderInterface extends Header {
    kind: 'header'
}

export interface SygicPointInterface extends Header {
    kind: 'sygicPoint'
}