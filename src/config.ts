import dotenv = require('dotenv')

export interface Config {
  port: string
  token: string
  ttl: string
}

export const config = () => {
  dotenv.config()

  if (!process.env.PORT || !process.env.TOKEN_SECRET || !process.env.DEFAULT_TTL)
    throw new Error('wrong env')

  const response: Config = {
    port: process.env.PORT,
    token: process.env.TOKEN_SECRET,
    ttl: process.env.DEFAULT_TTL,
  }
  return response
}
