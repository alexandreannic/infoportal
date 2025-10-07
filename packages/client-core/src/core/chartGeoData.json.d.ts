declare module './chartGeoData.json' {
  const value: {
    [countryCode: string]: {
      name: string
      regions: Record<string, string>
    }
  }
  export default value
}
