import * as express from 'express'
import { generateAccessToken, authenticateToken, Req } from './token_utils'
import { UploadedFile } from 'express-fileupload'
import * as cors from 'cors'
import { parseFiles } from './sygic-parser/parse_files'

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

    console.log(files)

    const keys = Object.keys(files)
    let filesArray: UploadedFile[] = []
    for (let key of keys) {
      const subObject = files[key] as any
      if (subObject.length) {
        filesArray = [...filesArray, ...subObject]
      } else {
        filesArray.push(subObject)
      }
    }

    const cleaningFactor = req.body['cleaning-factor']
      ? Math.pow(Number(req.body['cleaning-factor']), 2) * 0.0000011
      : undefined
    const gpxObject = parseFiles(filesArray, cleaningFactor, username)
    console.log(gpxObject.gpx.length)
    res.send(gpxObject)
  })
}
