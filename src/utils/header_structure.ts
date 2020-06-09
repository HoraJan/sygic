import { HeaderStructurePoint, StructureType, StringHeaderField, NumberHeaderField } from '../types'
import { parseString, parseInt, parseUtf16 } from './parsing_functions'

export const headerStructure: HeaderStructurePoint[] = [
  {
    length: 4,
    name: StringHeaderField.header,
    type: StructureType.string,
    parseFunction: parseString,
  },
  {
    length: 4,
    name: NumberHeaderField.favorite,
    type: StructureType.int,
    parseFunction: parseInt,
  },
  {
    length: 1,
    name: NumberHeaderField.type,
    type: StructureType.int,
    parseFunction: parseInt,
  },
  {
    length: 4,
    name: NumberHeaderField.duration,
    type: StructureType.int,
    parseFunction: parseInt,
  },
  {
    length: 4,
    name: NumberHeaderField.distance,
    type: StructureType.int,
    parseFunction: parseInt,
  },
  {
    length: 4,
    name: NumberHeaderField.segmentDistance,
    type: StructureType.int,
    parseFunction: parseInt,
  },
  {
    name: StringHeaderField.startDescription,
    type: StructureType.utf16,
    parseFunction: parseUtf16,
  },
  {
    name: StringHeaderField.endDescription,
    type: StructureType.utf16,
    parseFunction: parseUtf16,
  },
  {
    name: StringHeaderField.startTime,
    type: StructureType.utf16,
    parseFunction: parseUtf16,
  },
  {
    name: StringHeaderField.destination,
    type: StructureType.utf16,
    parseFunction: parseUtf16,
  },
  {
    length: 4,
    name: NumberHeaderField.endLon,
    type: StructureType.int,
    delimiter: 100000,
    parseFunction: parseInt,
  },
  {
    length: 4,
    name: NumberHeaderField.endLat,
    type: StructureType.int,
    delimiter: 100000,
    parseFunction: parseInt,
  },
  {
    length: 4,
    name: NumberHeaderField.pointCount,
    type: StructureType.int,
    parseFunction: parseInt,
  },
]
