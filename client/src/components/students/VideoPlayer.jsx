import React from "react";

const VideoPlayer = ({ data, onClose }) => {

  if (!data?.videoId) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

      <div className="relative w-[90%] max-w-3xl bg-black rounded-lg overflow-hidden">

        
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white bg-black/60 px-3 py-1 rounded hover:bg-black"
        >
          ✕
        </button>

       
        <div className="aspect-video">

          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${data.videoId}?autoplay=1`}
            title="Course Preview"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>

        </div>

      </div>

    </div>
  );
};

export default VideoPlayer;