import * as jwt from 'jsonwebtoken'
import { config } from './config'
import * as express from 'express'
import * as bodyParser from 'body-parser'

import * as fileupload from 'express-fileupload'
import { parseFile } from './parse_file'
import { UploadedFile } from 'express-fileupload'

interface Req extends express.Request {
  user?: any
}
interface User {
  username: string
}

const configObject = config()

const authenticateToken = (req: Req, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers['authorization']
  const [, token] = authHeader?.split(' ') ?? []
  console.log(token)
  if (token == null) {
    res.sendStatus(401)
    return
  }

  try {
    const user = jwt.verify(token, configObject.token ?? '')
    req.user = user
    next()
  } catch (err) {
    res.sendStatus(403)
  }
}

const generateAccessToken = (username: User) =>
  jwt.sign(username, configObject.token, { expiresIn: configObject.ttl })

const app: express.Application = express()
const http = require('http').Server(app)

app.use(bodyParser.json({ limit: '5mb' }))
app.use(fileupload())

http.listen(configObject.port, () => console.log(`listening on port ${configObject.port}`))

app.post('/api/login', (req, res) => {
  const token = generateAccessToken({ username: req.body.username })
  res.json(token)
})

app.get('/api/test-login', authenticateToken, (req, res) => {
  res.json({ resp: 'ok' })
})

app.post('/api/upload', authenticateToken, (req, res) => {
  const files = req.files
  console.log(files)

  if (!files) {
    res.sendStatus(204)
    return
  }

  const [key] = Object.keys(files)
  let file: UploadedFile
  const first = files[key] as any
  if (first.length) {
    file = first[0]
  } else {
    file = first
  }

  const [fileName] = file.name?.split('.')
  const fileContent = file.data
  console.log(fileName)
  const gpx = parseFile(fileName, fileContent)
  res.send(gpx)
})
