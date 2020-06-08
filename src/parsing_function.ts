import { HeaderStructurePoint, SygicPointStructurePoint, StructureType } from './types'

const groupBytes = (bytes: number[]): number => {
  return bytes.reduce((acc, cur, index) => {
    return acc + Math.pow(256, index) * cur
  }, 0)
}

const getValue = (
  type: StructureType,
  arr: number[],
  index: { index: number },
  delimiter = 1,
  add = 0,
  length = 0
): number | string => {
  if (type === 'utf16') {
    const length = groupBytes(arr.slice(index.index, index.index + 2))
    index.index += 2
    const letters = []
    for (let i = 0; i < length; i++) {
      const letter = groupBytes(arr.slice(index.index, index.index + 2))
      index.index += 2

      letters.push(letter)
    }
    return String.fromCharCode(...letters)
  }

  let valueArr = arr.slice(index.index, index.index + length)
  index.index += length

  if (type === 'string') {
    return String.fromCharCode(...valueArr)
  }

  if (type === 'int') {
    return groupBytes(valueArr) / delimiter + add
  }

  if (type === 'float') {
    const buf = new ArrayBuffer(4)
    const view = new DataView(buf)

    valueArr.reverse().forEach((b, i) => {
      view.setUint8(i, b)
    })

    const num = view.getFloat32(0)

    return num / delimiter
  }

  return valueArr[0]
}

export const parse = (
  field: HeaderStructurePoint | SygicPointStructurePoint,
  index: { index: number },
  arr: number[],
  finalObject: any
): void => {
  const value = getValue(field.type, arr, index, field.delimiter, field.add, field.length)

  finalObject[field.name] = value
}
