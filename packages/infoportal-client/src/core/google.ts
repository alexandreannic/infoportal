import {sleep} from '@axanc/ts-utils'
// import { Loader, Map, LatLngLiteral, Marker } from 'google.maps';

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
