import { StructurePoint, SygicLogEntryInterface } from '../types'

export const groupBytes = (bytes: number[]): number => {
  return bytes.reduce((acc, cur, index) => {
    return acc + Math.pow(256, index) * cur
  }, 0)
}

export const getValueArr = (logEntry: SygicLogEntryInterface, length: number): number[] => {
  const response = logEntry.arr.slice(logEntry.index, logEntry.index + length)
  logEntry.index += length
  return response
}

export const parseUtf16 = (field: StructurePoint, logEntry: SygicLogEntryInterface): string => {
  const LETTER_LENGTH = 2
  const length = groupBytes(getValueArr(logEntry, LETTER_LENGTH))
  const letters = []

  for (let i = 0; i < length; i++) {
    const letter = groupBytes(getValueArr(logEntry, LETTER_LENGTH))
    letters.push(letter)
  }

  return String.fromCharCode(...letters)
}

export const parseString = (field: StructurePoint, logEntry: SygicLogEntryInterface): string => {
  const { length = 0 } = field
  return String.fromCharCode(...getValueArr(logEntry, length))
}

export const parseInt = (field: StructurePoint, logEntry: SygicLogEntryInterface): number => {
  const { add = 0, delimiter = 1, length = 0 } = field
  const raw = getValueArr(logEntry, length)
  // console.log(
  //   raw,
  //   raw.map((num) => num.toString(16)),
  //   groupBytes(raw)
  // )
  return groupBytes(raw) / delimiter + add
}

export const parseFloat = (field: StructurePoint, logEntry: SygicLogEntryInterface): number => {
  const { add = 0, delimiter = 1, length = 0 } = field
  const buf = new ArrayBuffer(4)
  const view = new DataView(buf)

  const raw = getValueArr(logEntry, length)

  const reversed = [...raw].reverse()

  reversed.forEach((b, i) => {
    view.setUint8(i, b)
  })

  const num = view.getFloat32(0)

  // console.log(
  //   raw,
  //   raw.map((num) => num.toString(16)),
  //   groupBytes(raw),
  //   num
  // )
  return num / delimiter + add
}
