import { ajax } from 'rxjs/ajax'
import { catchError, map, tap } from 'rxjs/operators'
import { of, Subject, Observable } from 'rxjs'
import FileSaver from 'file-saver'

export interface LoginObject {
  login?: string
  error?: boolean
  message?: string
}

export const checkLogin = (url: string, token: string): Observable<LoginObject> => {
  return ajax({
    url: `${url}/api/test-login`,
    headers: { 'Access-Control-Allow-Origin': '*', Authorization: 'Bearer ' + token },
  }).pipe(
    map((response: any) => {
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

export const uploadFile = (url: string, formData: FormData, token: string): Observable<any> => {
  console.log(formData)
  return ajax({
    url: `${url}/api/upload`,
    method: 'POST',
    body: formData,
    headers: { 'Access-Control-Allow-Origin': '*', Authorization: 'Bearer ' + token },
  }).pipe(
    map((response) => {
      console.log(response)
      if (response.status === 200) {
        return response.response
      }
      throw new Error(JSON.stringify(response))
    }),
    tap((response: any) => {
      console.log(response)
      if (response.length < 1) return
      var blob = new Blob([response.gpx], { type: 'application/gpx;charset=utf-8' })
      FileSaver.saveAs(blob, `${response.name}.gpx`)
    }),
    catchError((error: Error) => {
      return of({ error: true, message: error.message } as LoginObject)
    })
  )
}

export const loginSubject = () => {
  return new Subject<Observable<LoginObject>>()
}

export const uploadSubject = () => {
  return new Subject<Observable<any>>()
}
