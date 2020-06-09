import { SygicPointStructurePoint, StructureType, SygicPointField } from '../types'
import { parseFloat, parseInt } from './parsing_functions'

export const pointStructure: SygicPointStructurePoint[] = [
  {
    length: 4,
    name: SygicPointField.lon,
    type: StructureType.int,
    delimiter: 100000,
    parseFunction: parseInt,
  },
  {
    length: 4,
    name: SygicPointField.lat,
    type: StructureType.int,
    delimiter: 100000,
    parseFunction: parseInt,
  },
  {
    length: 4,
    name: SygicPointField.elevation,
    type: StructureType.int,
    add: -32,
    parseFunction: parseInt,
  },
  {
    length: 4,
    name: SygicPointField.time,
    type: StructureType.int,
    parseFunction: parseInt,
  },
  {
    length: 4,
    name: SygicPointField.speed,
    type: StructureType.float,
    delimiter: 3.6,
    parseFunction: parseFloat,
  },
  {
    length: 1,
    name: SygicPointField.signalQuality,
    type: StructureType.int,
    parseFunction: parseInt,
  },
  {
    length: 1,
    name: SygicPointField.speeding,
    type: StructureType.int,
    parseFunction: parseInt,
  },
  {
    length: 1,
    name: SygicPointField.gsmSignalQuality,
    type: StructureType.int,
    parseFunction: parseInt,
  },
  {
    length: 1,
    name: SygicPointField.internetSignalQuality,
    type: StructureType.int,
    parseFunction: parseInt,
  },
  {
    length: 1,
    name: SygicPointField.batteryStatus,
    type: StructureType.int,
    parseFunction: parseInt,
  },
]
