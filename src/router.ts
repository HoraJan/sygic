import * as express from 'express'
import { generateAccessToken, authenticateToken, Req } from './token_utils'
import { UploadedFile } from 'express-fileupload'
import { parseFile } from './sygic-parser/parse_file'

export const router = (app: express.Application) => {
  app.post('/api/login', (req, res) => {
    const token = generateAccessToken({ username: req.body.username })
    res.json(token)
  })

  app.get('/api/test-login', authenticateToken, (req, res) => {
    res.json({ login: 'ok' })
  })

  app.post('/api/upload', authenticateToken, (req: Req, res) => {
    const files = req.files
    if (!files) {
      res.sendStatus(204)
      return
    }

    const [key] = Object.keys(files)
    let file: UploadedFile
    const subObject = files[key] as any
    if (subObject.length) {
      file = subObject[0]
    } else {
      file = subObject
    }

    const [fileName] = file.name?.split('.')
    const fileContent = file.data
    const gpx = parseFile(fileName, fileContent)

    res.send(gpx)
  })
}
