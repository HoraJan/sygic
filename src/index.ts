import { config } from './config'
import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as fileupload from 'express-fileupload'

import { router } from './router'

const configObject = config()
const app: express.Application = express()
const http = require('http').Server(app)

app.use(bodyParser.json({ limit: '5mb' }))
app.use(fileupload())

router(app)

http.listen(configObject.port, () => console.log(`listening on port ${configObject.port}`))
