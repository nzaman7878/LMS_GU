
import { Link } from 'react-router-dom'

const CoursesSection = () => {
  return (
    <div className="py-16 md:px-40 px-8 text-center">

      <h2 className="text-3xl font-medium text-gray-800">
        Learn from the best
      </h2>

      <p className="text-sm md:text-base text-gray-500 mt-3 max-w-2xl mx-auto">
        Discover our top-rated courses across various categories.
        From coding and design to business and wellness, our courses
        are crafted to deliver real results.
      </p>

      <div className="mt-6">
        <Link
          onClick={() => window.scrollTo(0, 0)}
          to="/course-list"
          className="text-gray-600 border border-gray-400/40 px-8 py-3 rounded hover:bg-gray-100 transition"
        >
          Show All Courses
        </Link>
      </div>

    </div>
  )
}

export default CoursesSection