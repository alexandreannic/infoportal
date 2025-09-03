import {Banner} from '@/shared/Banner/Banner'
import {Faq} from '@/shared/Faq/Faq'
import {Highlights} from '@/shared/Highlights/Highlights'
import {Overview} from '@/shared/Overview/Overview'

export default function Home() {
  return (
    <main>
      <Banner />
      <Highlights />
      <Overview />
      <Faq />
    </main>
  )
}
