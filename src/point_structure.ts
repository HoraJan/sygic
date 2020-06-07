import { SygicPointStructurePoint, StructureType, SygicPointField } from './types';

export const pointStructure: SygicPointStructurePoint[] = [
  {
    length: 4,
    name: SygicPointField.lon,
    type: StructureType.int,
    delimiter: 100000
  },
  {
    length: 4,
    name: SygicPointField.lat,
    type: StructureType.int,
    delimiter: 100000
  },
  {
    length: 4,
    name: SygicPointField.elevation,
    type: StructureType.int,
    add: -32
  },
  {
    length: 4,
    name: SygicPointField.time,
    type: StructureType.int
  },
  {
    length: 4,
    name: SygicPointField.speed,
    type: StructureType.float,
    delimiter: 3.6
  },
  {
    length: 1,
    name: SygicPointField.signalQuality,
    type: StructureType.byte
  },
  {
    length: 1,
    name: SygicPointField.speeding,
    type: StructureType.byte
  },
  {
    length: 1,
    name: SygicPointField.gsmSignalQuality,
    type: StructureType.byte
  },
  {
    length: 1,
    name: SygicPointField.internetSignalQuality,
    type: StructureType.byte
  },
  {
    length: 1,
    name: SygicPointField.batteryStatus,
    type: StructureType.byte
  }
];
