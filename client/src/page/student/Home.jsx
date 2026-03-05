import React from 'react'
import Hero from '../../components/students/Hero'
import SearchBar from '../../components/students/SearchBar'
import CoursesSection from '../../components/students/CoursesSection'
import TestimonialsSection from '../../components/students/TestimonialsSection'


const Home = () => {
  return (
    <div className='flex flex-col items-center space-y-7 text-center'>
    <Hero />
    <SearchBar />
    <CoursesSection />
    <TestimonialsSection />
    </div>
  )
}

export default Home