import * as jwt from 'jsonwebtoken'
import * as express from 'express'

import { config } from './config'

export interface Req extends express.Request {
  user?: string | object
}
interface User {
  username: string
}

const configObject = config()

export const authenticateToken = (req: Req, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers['authorization']
  const [, token] = authHeader?.split(' ') ?? []

  if (!token) {
    res.sendStatus(401)
    return
  }

  try {
    const user = jwt.verify(token, configObject.token)
    req.user = user
    next()
  } catch (err) {
    res.sendStatus(403)
  }
}

export const generateAccessToken = (username: User) =>
  jwt.sign(username, configObject.token, { expiresIn: configObject.ttl })
