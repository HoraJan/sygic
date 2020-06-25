import * as express from 'express'
import { generateAccessToken, authenticateToken, Req } from './token_utils'
import { UploadedFile } from 'express-fileupload'
import { parseFile } from './sygic-parser/parse_file'
import * as cors from 'cors'

export const router = (app: express.Application) => {
  app.use(cors())
  app.post('/api/login', (req, res) => {
    console.log(req.body)
    if (!req.body.username) {
      res.sendStatus(401)
      return
    }
    const token = generateAccessToken({ username: req.body.username })
    res.json({ token: token })
  })

  app.get('/api/test-login', authenticateToken, (req, res) => {
    res.json({ login: 'ok' })
  })

  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/app/index.html')
  })

  app.post('/api/upload', authenticateToken, (req: Req, res) => {
    const files = req.files
    if (!files) {
      res.sendStatus(204)
      return
    }

    if (typeof req.user === 'string' || !(req.user as any)?.username) {
      res.sendStatus(401)
      return
    }

    const username = (req.user as any).username

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
    const cleaningFactor = req.body['cleaning-factor']
      ? Math.pow(Number(req.body['cleaning-factor']), 2) * 0.0000011
      : undefined
    const gpx = parseFile(fileName, fileContent, cleaningFactor, username)

    res.send(gpx)
  })
}
