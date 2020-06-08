import { parseFile } from './parse_file'

const [, , ...filenames] = process.argv

filenames.forEach((fullName: string) => {
  const [fileName] = fullName.split('.')
  console.log(fileName)
  parseFile(fileName)
})
