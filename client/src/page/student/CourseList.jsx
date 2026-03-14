import { useContext } from "react"
import { AppContext } from "../../context/AppContext"
import SearchBar from "../../components/students/SearchBar"
import { useParams } from "react-router-dom"
import CourseCard from "../../components/students/CourseCard"

const CourseList = () => {

  const { navigate, allcourses } = useContext(AppContext)
  const { searchTerm } = useParams()

  return (
    <div className="md:px-36 px-8 pt-20">

      
      <div className="flex md:flex-row flex-col gap-6 items-start md:items-center justify-between">

        <div>
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-800">
            Course List
          </h1>

          <p className="text-gray-500 mt-1">
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => navigate('/')}
            >
              Home
            </span>
            {" / "} Course List
          </p>
        </div>

        <SearchBar data={searchTerm} />

      </div>

      
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">

        {allcourses?.map((course) => (
          <CourseCard key={course._id} course={course} />
        ))}

      </div>

    </div>
  )
}

export default CourseList