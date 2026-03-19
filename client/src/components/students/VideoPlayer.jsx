import { useEffect } from "react";

const VideoPlayer = ({ data, onClose }) => {

  if (!data?.videoId) return null;

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

        
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white bg-black/60 px-3 py-1 rounded hover:bg-black transition"
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
          />

        </div>

      </div>

    </div>
  );
};

export default VideoPlayer;


