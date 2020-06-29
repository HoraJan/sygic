import React, { FormEvent, useEffect, useState } from 'react'
import Head from 'next/head'
import fetch from 'unfetch'
import Login from './login'
import Upload from './upload'
import { checkLogin, loginSubject, uploadFile, uploadSubject } from '../utils/html-service'
import { tap, mergeMap } from 'rxjs/operators'
import { TITLE, LINKS } from '../utils/constants'
import Loading from './loading'
import { GetServerSideProps } from 'next'

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
  let $uploadSubject = uploadSubject()

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

  $uploadSubject
    .pipe(
      mergeMap((res) => res),
      tap((r) => console.log(r))
    )
    .subscribe()

  useEffect(() => {
    return () => {
      $checkLoginSubject.unsubscribe()
      $uploadSubject.unsubscribe()
    }
  })

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
    const formData = new FormData(e.currentTarget)
    console.log(formData)

    $checkLoginSubject.next(
      checkLogin(props.url, cookieToken).pipe(
        tap((r) => {
          console.log(r, e.currentTarget)
          if (r.login === 'ok') {
            $uploadSubject.next(uploadFile(props.url, formData, token))
          }
        })
      )
    )

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
