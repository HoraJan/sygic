import React, { FormEvent, useEffect, useState } from 'react'
import Head from 'next/head'
import fetch from 'unfetch'
import Login from './login'
import Upload from './upload'
import { checkLogin, loginSubject } from '../utils/html-service'
import { tap, mergeMap } from 'rxjs/operators'
import { TITLE, LINKS } from '../utils/constants'
import Loading from './loading'
import { GetServerSideProps } from 'next'
var FileSaver = require('file-saver')

export const getServerSideProps: GetServerSideProps<AppProps> = async () => {
  require('dotenv').config()

  const pageProps: AppProps = {
    url: process.env.NEXT_PUBLIC_API_URL ?? '',
  }
  return { props: pageProps }
}

interface AppProps {
  url: string
}

export default function App(props: AppProps) {
  const [token, setToken] = useState<string>()
  const [loading, setLoading] = useState<boolean>(true)
  const [login, setLogin] = useState<boolean>(false)
  let $checkLoginSubject = loginSubject()

  $checkLoginSubject
    .pipe(
      mergeMap((res) => res),
      tap((response) => {
        console.log(response)
        setLogin(!!response?.login)
      }),
      tap(() => setLoading(false))
    )
    .subscribe()

  useEffect(() => {
    const cookieToken = document?.cookie.split('token=')[1]
    if (!token) setToken(cookieToken)

    $checkLoginSubject.next(checkLogin(props.url, cookieToken))

    if (!cookieToken) setLoading(false)
  }, [])

  const loginSubmit = (e: FormEvent<HTMLFormElement>) => {
    fetch(`${props.url}/api/login`, {
      method: 'POST',
      body: new FormData(e.currentTarget),
    })
      .then((r) => r.json())
      .then((r) => {
        if (r.token) {
          document.cookie = 'token=' + r.token + '; path=/'
          setToken(r.token)
          $checkLoginSubject.next(checkLogin(props.url, r.token))
        }
      })
    e.preventDefault()
  }

  const fileUpload = (e: FormEvent<HTMLFormElement>) => {
    const cookieToken = document?.cookie.split('token=')[1]
    $checkLoginSubject.next(checkLogin(props.url, cookieToken))
    fetch(`${props.url}/api/upload`, {
      method: 'POST',
      body: new FormData(e.currentTarget),
      headers: { 'Access-Control-Allow-Origin': '*', Authorization: 'Bearer ' + token },
    })
      .then((r) => r.text())
      .then((r) => {
        console.log(r.length)
        var blob = new Blob([r], { type: 'application/xml;charset=utf-8' })
        FileSaver.saveAs(blob, 'converted.gpx')
      })
    e.preventDefault()
  }

  return (
    <div className="container">
      <Head>
        <title>{TITLE}</title>
        {LINKS.map((link, key) => (
          <link {...link} key={key} />
        ))}
      </Head>

      <main>
        {!login ? (
          loading ? (
            <Loading />
          ) : (
            <Login formSubmit={loginSubmit} />
          )
        ) : (
          <Upload formSubmit={fileUpload} />
        )}
      </main>
    </div>
  )
}
