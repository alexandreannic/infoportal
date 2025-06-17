import {sleep} from '@axanc/ts-utils'
// import { Loader, Map, LatLngLiteral, Marker } from 'google.maps';
import {useEffect} from 'react'
import {useAppSettings} from '@/core/context/ConfigContext'

declare const google: any

export const getGoogle = async () => {
  let trys = 0
  while (!google) {
    await sleep(200 + 100 * trys)
    trys++
    if (trys > 140) break
  }
  return google
}

export function GoogleMapLoader() {
  const {conf} = useAppSettings()
  useEffect(() => {
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${conf.gooogle.apiKey}`
    script.async = true
    script.defer = true
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  return null
}

export function GoogleChartsLoader() {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://www.gstatic.com/charts/loader.js'
    script.async = true
    script.type = 'text/javascript'
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  return null
}

// {isStupidMicrosoftBrowser && (
//   <IpAlert deletable="transient" color="warning" sx={{minHeight: 30, height: 30}}>
//   This app may not working well on Edge and IE. Please install a
// <Txt link sx={{textDecoration: 'underline'}}>
//   <a href="https://www.mozilla.org/en-US/firefox/new/">real browser</a>
// </Txt>
//   , not a Microsoft one.
// </IpAlert>
// )}
