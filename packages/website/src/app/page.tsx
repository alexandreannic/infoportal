import {Banner} from '@/shared/Banner/Banner'
import {Faq} from '@/shared/Faq/Faq'
import {Highlights} from '@/shared/Highlights/Highlights'
import {Overview} from '@/shared/Overview/Overview'
import {Footer} from '@/shared/Footer/Footer'

export default function Home() {
  return (
    <main>
      <Banner />
      <Highlights />
      <Overview />
      <Faq />
      <Footer/>
    </main>
  )
}
