import React from 'react';

const About = () => {

  const images = [
    {
      src: "https://res.cloudinary.com/dhvrmmzux/image/upload/v1780910981/unnamed_hoppyw.jpg",
      alt: "GU Main Featured",
      className: "md:col-span-2 md:row-span-2 h-64 md:h-full" // Large featured image
    },
    {
      src: "https://res.cloudinary.com/dhvrmmzux/image/upload/v1780604802/unnamed_4_hmrmmm.webp",
      alt: "GU Campus",
      className: "col-span-1 h-40 md:h-56"
    },
    {
      src: "https://res.cloudinary.com/dhvrmmzux/image/upload/v1780604792/unnamed_1_b1n4vw.webp",
      alt: "GU Academics",
      className: "col-span-1 h-40 md:h-56"
    },
    {
      src: "https://res.cloudinary.com/dhvrmmzux/image/upload/v1780910903/download_muau3q.jpg",
      alt: "GU Library",
      className: "col-span-1 h-40 md:h-56"
    },
    {
      src: "https://res.cloudinary.com/dhvrmmzux/image/upload/v1780604791/unnamed_6_wsoeym.webp",
      alt: "GU Students",
      className: "col-span-1 h-40 md:h-56"
    },
    
  ];

  return (
    <div className="w-full font-sans bg-gradient-to-b from-cyan-100/70 to-white min-h-screen pb-20">
      
      
      <div className="flex flex-col items-center justify-center w-full pt-20 md:pt-36 px-7 md:px-0 space-y-7 text-center mb-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 max-w-4xl mx-auto leading-tight">
          About <span className="text-blue-600">Gauhati University</span>
        </h1>

     
        <p className="md:block hidden text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
          One of the premier institutions of higher education in Northeast India. 
          Established with a vision to promote academic excellence and cultural advancement, 
          GU has emerged as a leading postgraduate and research university, recognized with 
          an esteemed <strong className="text-gray-800">NAAC A+ Grade</strong>.
        </p>

     
        <p className="md:hidden text-gray-600 max-w-sm mx-auto leading-relaxed">
          A premier institution of higher education in Northeast India, holding an esteemed 
          <strong className="text-gray-800"> NAAC A+ Grade</strong>.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
      
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 mb-20">
          {images.map((img, index) => (
            <div 
              key={index} 
              className={`overflow-hidden rounded-2xl shadow-sm border border-gray-200 bg-white ${img.className}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>

  
        <div className="grid lg:grid-cols-2 gap-8 md:gap-10">

          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">Legacy & Excellence</h2>
            <p className="mb-8 text-gray-600 leading-relaxed">
              Founded under the leadership of the eminent scholar and philanthropist <strong className="text-gray-800">Krishna Kanta Handiqui</strong>, serving as its first Vice Chancellor.
            </p>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-4">Distinguished Alumni</h3>
                <ul className="space-y-3">
                  {[
                    { name: "Dr. Bhupen Hazarika", title: "Bharat Ratna Awardee" },
                    { name: "Mamoni Raisom Goswami", title: "Jnanpith Award-winning Writer" },
                    { name: "Dr. Jitendra Nath Goswami", title: "Chief Scientist, Chandrayaan" }
                  ].map((person, i) => (
                    <li key={i} className="flex items-start">
                      <span className="w-1.5 h-1.5 mt-2.5 mr-3 bg-cyan-500 rounded-full flex-shrink-0"></span>
                      <p className="text-gray-600"><span className="font-semibold text-gray-800">{person.name}</span> — {person.title}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-3">Influential Leaders</h3>
                <div className="flex flex-wrap gap-2">
                  {["Prafulla Kumar Mahanta", "Tarun Gogoi", "Sarbananda Sonowal", "Dr. Himanta Biswa Sarma"].map(name => (
                    <span key={name} className="bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg text-sm border border-gray-200">
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8 md:gap-10">
            
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Achievements</h2>
              <ul className="space-y-4">
                <li className="flex items-center text-gray-600 bg-cyan-50/50 p-4 rounded-xl border border-cyan-100/50">
                  <span className="text-blue-600 font-bold mr-3">✓</span>
                  <span><strong className="text-gray-800">NAAC A+ Grade</strong> Institution</span>
                </li>
                <li className="flex items-center text-gray-600 bg-cyan-50/50 p-4 rounded-xl border border-cyan-100/50">
                  <span className="text-blue-600 font-bold mr-3">✓</span>
                  <span>Top-ranked in Northeast India (NIRF 2024)</span>
                </li>
                <li className="flex items-center text-gray-600 bg-cyan-50/50 p-4 rounded-xl border border-cyan-100/50">
                  <span className="text-blue-600 font-bold mr-3">✓</span>
                  <span>Recipient of the <strong>National NSS Award</strong></span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">Academic Impact</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                As the oldest university in the region, GU acts as a mentor institution for hundreds of colleges across Assam.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl">
                  <p className="font-semibold text-gray-800 mb-1">Multidisciplinary</p>
                  <p className="text-gray-500 text-sm">Science, Humanities, Commerce & Tech.</p>
                </div>
                <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl">
                  <p className="font-semibold text-gray-800 mb-1">Knowledge Hub</p>
                  <p className="text-gray-500 text-sm">Driving regional socio-economic development.</p>
                </div>
              </div>
            </div>
          </div>

       
          <div className="lg:col-span-2 bg-blue-600 rounded-3xl p-8 md:p-12 shadow-md text-white mt-2">
            <div className="flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="md:w-1/2">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Role in This LMS</h2>
                <p className="text-blue-100 leading-relaxed text-lg">
                  This platform extends Gauhati University's vision of accessible, modern education, bridging the gap between traditional excellence and next-generation learning environments.
                </p>
              </div>

              <div className="md:w-1/2 grid grid-cols-2 gap-4 w-full">
                {[
                  { title: "Digital Resources", desc: "24/7 access to materials" },
                  { title: "Course Mgmt", desc: "Streamlined curriculum" },
                  { title: "Collaboration", desc: "Student & Faculty networking" },
                  { title: "Modern UX", desc: "Intuitive learning journey" }
                ].map((feature, i) => (
                  <div key={i} className="bg-white/10 border border-white/20 p-5 rounded-xl">
                    <h4 className="font-bold text-white mb-1">{feature.title}</h4>
                    <p className="text-blue-200 text-sm">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default About;