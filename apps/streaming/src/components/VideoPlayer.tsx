"use client";

import { useRef, useState, useEffect } from "react";
import {
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
} from "@heroicons/react/24/outline";

interface VideoPlayerProps {
  src: string;
  title: string;
  autoPlay?: boolean;
  controls?: boolean;
  poster?: string;
  className?: string;
}

// Helper function to detect if URL is an embed URL
function isEmbedUrl(url: string): boolean {
  return url.includes('/embed/') || 
         url.includes('youtube.com/embed/') || 
         url.includes('vimeo.com/') ||
         url.includes('themediacdn.com/embed/');
}

export function VideoPlayer({
  src,
  title,
  autoPlay = false,
  controls = true,
  poster,
  className = "",
}: VideoPlayerProps) {
  const isEmbed = isEmbedUrl(src);
  
  // Initialize hooks for all code paths (required by React rules)
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isEmbed) return; // Skip effect for embed URLs
    
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      setIsBuffering(false);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleWaiting = () => {
      setIsBuffering(true);
    };

    const handleCanPlay = () => {
      setIsBuffering(false);
    };

    const handleVolumeChange = () => {
      setIsMuted(video.muted);
      setVolume(video.volume);
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("volumechange", handleVolumeChange);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("volumechange", handleVolumeChange);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isEmbed]);

  // For embed URLs, render a simpler iframe-based player
  if (isEmbed) {
    return (
      <div className={`relative w-full bg-black rounded-lg overflow-hidden ${className}`}>
        <div className="relative w-full" style={{ paddingBottom: '56.25%' /* 16:9 aspect ratio */ }}>
          <iframe
            src={src}
            title={title}
            className="absolute top-0 left-0 w-full h-full border-0"
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            allowFullScreen
            loading="lazy"
          />
        </div>
      </div>
    );
  }

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = parseFloat(e.target.value);
    video.volume = newVolume;
    setVolume(newVolume);
    
    if (newVolume === 0) {
      video.muted = true;
    } else if (video.muted) {
      video.muted = false;
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = parseFloat(e.target.value);
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleFullscreen = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (isFullscreen) {
        await document.exitFullscreen();
      } else {
        await video.requestFullscreen();
      }
    } catch (error) {
      console.error("Fullscreen error:", error);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  const handleMouseLeave = () => {
    if (isPlaying) {
      setShowControls(false);
    }
  };

  return (
    <div 
      className={`relative w-full bg-black rounded-lg overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        muted={autoPlay} // Auto-playing videos should be muted by default
        className="w-full h-auto max-h-[70vh] object-contain"
        onClick={togglePlay}
        preload="metadata"
        aria-label={title}
      />

      {/* Buffering indicator */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Controls */}
      {controls && (
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Progress bar */}
          <div className="mb-4">
            <input
              type="range"
              min={0}
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #ee1518 0%, #ee1518 ${
                  (currentTime / duration) * 100
                }%, #666 ${(currentTime / duration) * 100}%, #666 100%)`,
              }}
            />
          </div>

          {/* Control buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="text-white hover:text-gray-300 transition-colors"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <PauseIcon className="h-6 w-6" />
                ) : (
                  <PlayIcon className="h-6 w-6" />
                )}
              </button>

              {/* Volume controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleMute}
                  className="text-white hover:text-gray-300 transition-colors"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted || volume === 0 ? (
                    <SpeakerXMarkIcon className="h-5 w-5" />
                  ) : (
                    <SpeakerWaveIcon className="h-5 w-5" />
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #ee1518 0%, #ee1518 ${
                      (isMuted ? 0 : volume) * 100
                    }%, #666 ${(isMuted ? 0 : volume) * 100}%, #666 100%)`,
                  }}
                />
              </div>

              {/* Time display */}
              <span className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center space-x-4">
              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="text-white hover:text-gray-300 transition-colors"
                aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              >
                {isFullscreen ? (
                  <ArrowsPointingInIcon className="h-5 w-5" />
                ) : (
                  <ArrowsPointingOutIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom slider styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #ee1518;
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
          transition: transform 0.2s ease;
        }
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #ee1518;
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
          transition: transform 0.2s ease;
        }
        .slider::-moz-range-thumb:hover {
          transform: scale(1.2);
        }
      `}</style>
    </div>
  );
}