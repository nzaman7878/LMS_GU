import { assets } from "../../assets/assets.js"; 
import { useContext } from "react";
import { AppContext } from "../../context/AppContext.jsx";
import { Link } from "react-router-dom";

const CourseCard = ({ course }) => {
  const { currency, calculateRating } = useContext(AppContext);

  const discountedPrice = (
    course.coursePrice -
    (course.coursePrice * course.discount) / 100
  ).toFixed(2);

  return (
    <Link
      to={"/courses/" + course._id}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="bg-white border border-gray-200 rounded-xl overflow-hidden 
                 shadow-sm hover:shadow-lg transition duration-300"
    >
      {/* Thumbnail */}
      <div className="aspect-video overflow-hidden">
        <img
          className="w-full h-full object-cover hover:scale-105 transition duration-300"
          src={course.courseThumbnail}
          alt={course.courseTitle}
        />
      </div>

      {/* Content */}
      <div className="p-4 text-left space-y-2">

        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
          {course.courseTitle}
        </h3>

        <p className="text-sm text-gray-500">
          {course.educator?.name}
        </p>

        {/* Rating */}
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">{calculateRating(course)}</p>

          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <img
                key={i}
                src={i < Math.floor(calculateRating(course)) ? assets.star : assets.star_blank}
                alt="star"
                className="w-4 h-4"
              />
            ))}
          </div>

          <p className="text-sm text-gray-500">{course.courseRatings?.length || 0} reviews</p>
        </div>

        {/* Price */}
        <div className="flex items-center space-x-2 pt-1">
          <p className="text-lg font-bold text-gray-900">
            {currency}{discountedPrice}
          </p>

          {course.discount > 0 && (
            <p className="text-sm text-gray-400 line-through">
              {currency}{course.coursePrice}
            </p>
          )}
        </div>

      </div>
    </Link>
  );
};

export default CourseCard;