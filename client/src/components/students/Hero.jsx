import { assets } from "../../assets/assets";
import SearchBar from "./SearchBar";

const Hero = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full md:pt-36 pt-20 px-7 md:px-0 space-y-7 text-center bg-linear-to-b from-cyan-100/70 to-white">

    
      <h1 className="md:text-home-heading-large text-home-heading-small relative font-bold text-gray-800 max-w-3xl mx-auto leading-tight">
        Bringing the Excellence of{" "}
        <span className="text-blue-600">
          Guwahati University
        </span>{" "}
        to Digital Learning

        <img
          className="md:block hidden absolute -bottom-6 right-4 w-28"
          src={assets.sketch}
          alt="sketch"
        />
      </h1>

     
      <p className="md:block hidden text-gray-600 max-w-2xl mx-auto text-lg">
        Guwahati University has long been known for its outstanding
        offline education and dedicated faculty. Now, we are extending
        that same academic excellence into the digital world through
        through our digital LMS platform, allowing students to
        access courses, resources, and guidance anytime, anywhere.
      </p>

     
      <p className="md:hidden text-gray-600 max-w-sm mx-auto">
        Experience Guwahati University's academic excellence
        now available through our digital LMS platform.
      </p>

    

    <SearchBar />
    </div>
  );
};

export default Hero;