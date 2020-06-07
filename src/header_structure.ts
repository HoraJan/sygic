import { HeaderStructurePoint, StructureType, StringHeaderField, NumberHeaderField } from './types';

export const headerStructure:  HeaderStructurePoint[] = [
  {
    length: 4,
    name: StringHeaderField.header,
    type: StructureType.string
  },
  {
    length: 4,
    name: NumberHeaderField.favorite,
    type: StructureType.int
  },
  {
    length: 1,
    name: NumberHeaderField.type,
    type: StructureType.byte
  },
  {
    length: 4,
    name: NumberHeaderField.duration,
    type: StructureType.int
  },
  {
    length: 4,
    name: NumberHeaderField.distance,
    type: StructureType.int
  },
  {
    length: 4,
    name: NumberHeaderField.segmentDistance,
    type: StructureType.int
  },
  {
    name: StringHeaderField.startDescription,
    type: StructureType.utf16
  },
  {
    name: StringHeaderField.endDescription,
    type: StructureType.utf16
  },
  {
    name: StringHeaderField.startTime,
    type: StructureType.utf16
  },
  {
    name: StringHeaderField.destination,
    type: StructureType.utf16
  },
  {
    length: 4,
    name: NumberHeaderField.endLon,
    type: StructureType.int,
    delimiter: 100000
  },
  {
    length: 4,
    name: NumberHeaderField.endLat,
    type: StructureType.int,
    delimiter: 100000
  },
  {
    length: 4,
    name: NumberHeaderField.pointCount,
    type: StructureType.int
  }
];
