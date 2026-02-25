import { assets } from "../../assets/assets.js"; 
import { useContext } from "react";
import { AppContext } from "../../context/AppContext.jsx";

const CourseCard = ({ course }) => {
  const { currency } = useContext(AppContext);

  return (
    <div>
      <img src={course.courseThumbnail} alt="" />
      <div>
        <h3>{course.courseTitle}</h3>
        <p>{course.educator.name}</p>

        <div>
          <p>4.5</p>
          <div>
            {[...Array(5)].map((_, i) => (
              <img key={i} src={assets.star} alt="star" />
            ))}
          </div>
          <p>22</p>
        </div>

        <p>
          {currency}
          {(course.coursePrice - 
            (course.coursePrice * course.discount) / 100
          ).toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default CourseCard;