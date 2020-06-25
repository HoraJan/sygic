import { ajax, AjaxResponse } from 'rxjs/ajax'
import { catchError, mergeMap, map } from 'rxjs/operators'
import { of, Subject, Observable } from 'rxjs'

const CHECK_LOGIN_URL = 'http://localhost:8080/api/test-login'

export interface LoginObject {
  login?: string
  error?: boolean
  message?: string
}

export const checkLogin = (token: string): Observable<LoginObject> => {
  console.log(token)
  return ajax({
    url: CHECK_LOGIN_URL,
    headers: { 'Access-Control-Allow-Origin': '*', Authorization: 'Bearer ' + token },
  }).pipe(
    map((response) => {
      if (response.status === 200) {
        return { login: response.response.login.toString() } as LoginObject
      }
      return { error: true, message: `Error ${response.status}` } as LoginObject
    }),
    catchError((error: Error) => {
      return of({ error: true, message: error.message } as LoginObject)
    })
  )
}

export const loginSubject = () => {
  return new Subject<Observable<LoginObject>>()
}
