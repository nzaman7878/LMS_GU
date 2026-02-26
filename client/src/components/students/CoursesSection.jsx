import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from '../../context/AppContext'
import CourseCard from './CourseCard'

const CoursesSection = () => {

  const { allcourses } = useContext(AppContext)

  return (
    <div className="py-16 md:px-20 px-6 text-center">

      <h2 className="text-3xl md:text-4xl font-semibold text-gray-800">
        Learn from the best
      </h2>

      <p className="text-sm md:text-base text-gray-500 mt-4 max-w-2xl mx-auto leading-relaxed">
        Discover our top-rated courses across various categories.
        From coding and design to business and wellness,
        our courses are crafted to deliver real results.
      </p>

      
      <div className="grid sm:grid-cols-auto lg:grid-cols-4 gap-6 mt-12">
        {allcourses?.slice(0, 4).map((course) => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>

      
      <div className="mt-10">
        <Link
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          to="/course-list"
          className="inline-block text-gray-700 border border-gray-300 
                     px-8 py-3 rounded-lg hover:bg-gray-100 
                     transition duration-300"
        >
          Show All Courses
        </Link>
      </div>

    </div>
  )
}

export default CoursesSection