import {appConfig} from '@/conf/AppConfig'
import {MarkerClusterer} from '@googlemaps/markerclusterer'

declare var google: any
/**
 * Was used in old ProtMonito dashboard that had kobo geolocalisation
 */
export const initGoogleMaps = async ({
  mapId = appConfig.gooogle.mapId,
  apiKey = appConfig.gooogle.apiKey,
  color,
  bubbles,
  domSelector,
}: {
  apiKey?: string
  domSelector: string
  mapId?: string
  color: string
  bubbles: {
    loc: [number, number]
    size: number
    label: string
    desc: string
  }[]
}) => {
  // let trys = 0
  // while (typeof (window as any).google === 'undefined') {
  //   await sleep(200 + 100 * trys)
  //   trys++
  //   if (trys > 140) break
  // }
  await loadGoogleMaps(apiKey, ['places'])
  console.log(google)
  // const ukraineCenter: google.maps.LatLngLiteral = {lat: 48.96008674231441, lng: 31.702957509661097}
  const map = new google.maps.Map(document.querySelector(domSelector) as HTMLElement, {
    mapId: mapId,
    // center: ukraineCenter,
    zoom: 5.1,
    controlSize: 32,
  })
  // const max = Math.max(...bubbles.map(_ => _.size))
  // const flatted = bubbles.map((_: any) => {
  //   _.opacity = (_.size / max) * 0.7
  //   return _
  // })
  const bounds = new google.maps.LatLngBounds()

  const markers = bubbles.map(_ => {
    if (!_.loc?.[0]) return
    const position = new google.maps.LatLng(_.loc[0], _.loc[1])
    bounds.extend(position)
    return new google.maps.Marker({
      map,
      position,
      // title: `${_.label} (${_.size})`,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        fillOpacity: 1, //0.3 + _.opacity,
        fillColor: color,
        // strokeOpacity: 1.0,
        // strokeColor: olor,
        strokeWeight: 0,
        scale: 5, //pixels
      },
    })
    // marker.addListener('click', () => {
    //   new google.maps.InfoWindow({
    //     content: `<h1 style="margin: 0; line-height: 1; padding: 0; margin-top: -3px">${_.size}</h1><b>${_.label}</b><br/>${_.desc ?? ''}`,
    //     // ariaLabel: "Uluru",
    //   }).open({
    //     anchor: marker,
    //     map,
    //   })
    // })

    // const circle = new google.maps.Circle({
    //   clickable: true,
    //   strokeColor: color,
    //   strokeOpacity: _.opacity ?? 1,
    //   strokeWeight: .25,
    //   fillColor: color,
    //   fillOpacity: 0.2,
    //   map,
    //   scale: 20,
    //   center: {lat: _.loc[0], lng: _.loc[1]},
    //   radius: Math.sqrt(_.size ?? 1) * 1000,
    // })
    // google.maps.event.addListener(circle, 'mouseover', function () {
    //   map.getDiv().setAttribute('title', (_.opacity ?? _.size) + '')
    // })
  })
  new MarkerClusterer({markers, map})

  if (!bounds.isEmpty()) {
    map.fitBounds(bounds)
  }
}

const loadGoogleMaps = (apiKey: string, libraries: string[] = []) => {
  return new Promise<void>((resolve, reject) => {
    if (typeof google !== 'undefined' && google.maps) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=${libraries.join(',')}`
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject('Google Maps failed to load')
    document.head.appendChild(script)
  })
}
