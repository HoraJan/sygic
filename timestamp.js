const fs = require('fs')

const file = fs.readFileSync('./timestamp.data')

const arr = [...file]

const pointsNum = arr.length / 8

const result = []

for (let pointIndex = 0; pointIndex < pointsNum; pointIndex++) {
  const buf = new ArrayBuffer(8)
  const view = new DataView(buf)
  const raw = arr.slice(pointIndex * 8, pointIndex * 8 + 8)

  const reversed = [...raw].reverse()

  reversed.forEach((b, i) => {
    view.setUint8(i, b)
  })

  const num = view.getFloat64(0)

  result[pointIndex] = num
}

console.log(result.map((ts) => new Date(ts * 1000)).join('\n'))
