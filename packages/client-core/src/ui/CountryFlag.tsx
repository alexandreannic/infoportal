import React from 'react'

export function CountryFlag({code}: {code: string}) {
  const flag = code.toUpperCase().replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt(0)))
  return <span style={{fontSize: '1.5rem', marginRight: 8}}>{flag}</span>
}
