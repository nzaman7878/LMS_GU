import React, { useEffect } from "react";

const VideoPlayer = ({ data, onClose }) => {

  if (!data?.videoId) return null;

  // Close player with ESC key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKey);

    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >

      <div
        className="relative w-full max-w-3xl bg-black rounded-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white bg-black/60 px-3 py-1 rounded hover:bg-black transition"
        >
          ✕
        </button>

        {/* Video */}
        <div className="aspect-video">

          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${data.videoId}?autoplay=1`}
            title="Course Preview"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />

        </div>

      </div>

    </div>
  );
};

export default VideoPlayer;


<div className="pt-6 text-gray-600 text-sm md:text-default">

              <p className="md:text-xl text-lg font-medium text-gray-800">
                What's in the course?
              </p>

              <ul className="ml-4 pt-2 list-disc text-gray-500">
                <li>Lifetime access with free updates</li>
                <li>Step by Step, hands-on project guidance</li>
                <li>Downloadable resources and code</li>
                <li>Quizzes to test your knowledge</li>
                <li>Certificate of completion</li>
              </ul>

            </div>