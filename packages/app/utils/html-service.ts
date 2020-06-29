import { ajax } from 'rxjs/ajax'
import { catchError, map } from 'rxjs/operators'
import { of, Subject, Observable } from 'rxjs'

export interface LoginObject {
  login?: string
  error?: boolean
  message?: string
}

export const checkLogin = (url: string, token: string): Observable<LoginObject> => {
  console.log(token)
  return ajax({
    url: `${url}/api/test-login`,
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
