import React from "react";

interface VideoPlayerProps {
  videoSrc: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoSrc }) => {
  return (
    <div className="relative w-full h-0" style={{ paddingBottom: "56.25%" }}>
      <iframe
        src={videoSrc}
        title="Video Player"
        className="absolute top-0 left-0 w-full h-full"
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen
      />
    </div>
  );
};

export { VideoPlayer };
