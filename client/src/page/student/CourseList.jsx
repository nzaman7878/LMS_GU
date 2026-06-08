import { useContext, useEffect, useState } from "react"
import { AppContext } from "../../context/AppContext"
import SearchBar from "../../components/students/SearchBar"
import { useParams } from "react-router-dom"
import CourseCard from "../../components/students/CourseCard"
import { assets } from "../../assets/assets"

const CourseList = () => {

  const { navigate, allCourses } = useContext(AppContext)
  const { searchTerm } = useParams()

  const [filteredCourses, setFilteredCourses] = useState([])

  useEffect(() => {
  
    let tempCourses = allCourses ? [...allCourses] : [];

  
    if (searchTerm) {
      tempCourses = tempCourses.filter((course) =>
        course.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    tempCourses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

   
    setFilteredCourses(tempCourses);

  }, [searchTerm, allCourses])

  return (
    <>
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
        {
          searchTerm && <div className="inline-flex items-center gap-4 px-4 py-2 border mt-8 mb-8 text-gray-600">
            <p>{searchTerm}</p>
            <img src={assets.cross_icon} alt=""
              className="cursor-pointer" onClick={() =>
                navigate("/course-list")
              } />
          </div>
        }
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">

          {filteredCourses?.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}

        </div>


      </div>

    </>
  )
}

export default CourseList