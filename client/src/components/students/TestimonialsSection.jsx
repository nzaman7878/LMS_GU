import React from "react";
import { assets, dummyTestimonial } from "../../assets/assets.js";

const TestimonialsSection = () => {
  return (
    <section className="w-full bg-gray-50 py-16">
      
    
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
       
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800">
            Testimonials
          </h2>
          <p className="text-sm sm:text-base text-gray-500 mt-4 leading-relaxed">
            Hear from our learners as they share their journeys of transformation
            through our courses, their success stories, and how our platform has
            empowered them to achieve their goals.
          </p>
        </div>

        
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {dummyTestimonial.map((testimonial, index) => (
            
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition duration-300 flex flex-col justify-between"
            >
              
             
              <div>
                
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-base sm:text-lg font-medium text-gray-800">
                      {testimonial.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {testimonial.role}
                    </p>
                  </div>
                </div>

                
                <div className="flex items-center gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <img
                      key={i}
                      src={
                        i < Math.floor(testimonial.rating)
                          ? assets.star
                          : assets.star_blank
                      }
                      alt="star"
                      className="w-4"
                    />
                  ))}
                </div>

                
                <p className="text-gray-600 text-sm mt-4 leading-relaxed">
                  {testimonial.feedback}
                </p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TestimonialsSection;