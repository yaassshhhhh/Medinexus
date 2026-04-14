import React from 'react'
import Header from '../components/Header'
import SpecialityMenu from '../components/SpecialityMenu'
import TopDoctors from '../components/TopDoctors'
import Banner from '../components/Banner'
import StatsSection from '../components/StatsSection'

const Home = () => {
  return (
    <div>
      <Header/>
      <SpecialityMenu/>
      <StatsSection/>
      <TopDoctors/>
      <Banner/>
    </div>
  )
}

export default Home
