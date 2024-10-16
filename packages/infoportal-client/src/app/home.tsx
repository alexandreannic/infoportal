'use client'
import {GetServerSideProps} from 'next'

export const getServerSideProps: GetServerSideProps = async ({req, res}) => {
  return {
    props: {}
  }
}

const Home = () => {
  return (
    <div>Home</div>
  )
}

export default Home