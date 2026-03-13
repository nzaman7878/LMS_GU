import { assets } from '../../assets/assets.js'

const CallToAction = () => {
  return (
    <div className="flex flex-col items-center text-center max-w-2xl mx-auto px-6 py-20 gap-6">

      <h1 className="text-2xl md:text-4xl font-semibold text-gray-900">
        Learn anything, anytime, anywhere
      </h1>

      <p className="text-gray-500 text-sm md:text-base leading-relaxed">
  Start your learning journey today and unlock new opportunities. 
  Explore expert-led courses designed to help you grow your skills. 
  Learn at your own pace from anywhere in the world. 
  Take the first step toward achieving your goals.
      </p>

      <div className="flex items-center gap-5 mt-2">

        <button className="px-8 py-3 bg-blue-600 text-white rounded-lg 
                           hover:bg-blue-700 transition">
          Get Started
        </button>

        <button className="flex items-center gap-2 text-gray-700 
                           hover:text-blue-600 transition">
          Learn More
          <img
            src={assets.arrow_icon}
            alt="arrow"
            className="w-4"
          />
        </button>

      </div>

    </div>
  )
}

export default CallToAction