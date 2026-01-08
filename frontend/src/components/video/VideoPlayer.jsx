import React, { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

const VideoPlayer = ({ 
  src, 
  poster,
  onTimeUpdate,
  onEnded,
  onReady,
  initialTime = 0,
  autoplay = false 
}) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current && videoRef.current) {
      const videoElement = videoRef.current;

      const player = videojs(videoElement, {
        autoplay: autoplay,
        controls: true,
        responsive: true,
        fluid: true,
        playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 2],
        controlBar: {
          children: [
            'playToggle',
            'volumePanel',
            'currentTimeDisplay',
            'timeDivider',
            'durationDisplay',
            'progressControl',
            'playbackRateMenuButton',
            'qualitySelector',
            'pictureInPictureToggle',
            'fullscreenToggle',
          ],
        },
        sources: src ? [{ src, type: 'video/mp4' }] : [],
        poster: poster,
      });

      playerRef.current = player;

      // Event handlers
      player.on('ready', () => {
        setIsReady(true);
        if (initialTime > 0) {
          player.currentTime(initialTime);
        }
        if (onReady) {
          onReady(player);
        }
      });

      player.on('timeupdate', () => {
        if (onTimeUpdate) {
          onTimeUpdate({
            currentTime: player.currentTime(),
            duration: player.duration(),
            percentage: (player.currentTime() / player.duration()) * 100,
          });
        }
      });

      player.on('ended', () => {
        if (onEnded) {
          onEnded();
        }
      });

      // Keyboard shortcuts
      player.on('keydown', (e) => {
        switch (e.key) {
          case 'ArrowLeft':
            e.preventDefault();
            player.currentTime(Math.max(0, player.currentTime() - 10));
            break;
          case 'ArrowRight':
            e.preventDefault();
            player.currentTime(Math.min(player.duration(), player.currentTime() + 10));
            break;
          case ' ':
            e.preventDefault();
            if (player.paused()) {
              player.play();
            } else {
              player.pause();
            }
            break;
          case 'f':
          case 'F':
            e.preventDefault();
            if (player.isFullscreen()) {
              player.exitFullscreen();
            } else {
              player.requestFullscreen();
            }
            break;
          case 'm':
          case 'M':
            e.preventDefault();
            player.muted(!player.muted());
            break;
          default:
            break;
        }
      });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  // Update source when src changes
  useEffect(() => {
    if (playerRef.current && src) {
      playerRef.current.src({ src, type: 'video/mp4' });
    }
  }, [src]);

  return (
    <div className="video-player-wrapper">
      <div data-vjs-player>
        <video
          ref={videoRef}
          className="video-js vjs-big-play-centered vjs-theme-medical"
        />
      </div>

      {/* Custom Styles */}
      <style>{`
        .video-player-wrapper {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
        }

        .vjs-theme-medical .vjs-control-bar {
          background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
          height: 50px;
        }

        .vjs-theme-medical .vjs-play-progress {
          background: linear-gradient(90deg, #3b82f6, #6366f1);
        }

        .vjs-theme-medical .vjs-volume-level {
          background: #3b82f6;
        }

        .vjs-theme-medical .vjs-big-play-button {
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          border: none;
          border-radius: 50%;
          width: 80px;
          height: 80px;
          line-height: 80px;
          font-size: 40px;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .vjs-theme-medical .vjs-big-play-button:hover {
          transform: scale(1.1);
          box-shadow: 0 10px 30px rgba(99, 102, 241, 0.4);
        }

        .vjs-theme-medical:hover .vjs-big-play-button {
          background: linear-gradient(135deg, #2563eb, #4f46e5);
        }

        .vjs-theme-medical .vjs-slider {
          background: rgba(255, 255, 255, 0.2);
        }

        .vjs-theme-medical .vjs-load-progress {
          background: rgba(255, 255, 255, 0.3);
        }

        .vjs-theme-medical .vjs-time-control {
          font-size: 13px;
          font-weight: 500;
        }

        .vjs-theme-medical .vjs-playback-rate .vjs-menu-content {
          background: rgba(0, 0, 0, 0.9);
          border-radius: 8px;
        }

        .vjs-theme-medical .vjs-menu-item {
          padding: 8px 16px;
        }

        .vjs-theme-medical .vjs-menu-item:hover,
        .vjs-theme-medical .vjs-menu-item.vjs-selected {
          background: #3b82f6;
        }

        /* Responsive */
        @media (max-width: 640px) {
          .vjs-theme-medical .vjs-big-play-button {
            width: 60px;
            height: 60px;
            line-height: 60px;
            font-size: 30px;
          }
        }
      `}</style>
    </div>
  );
};

export default VideoPlayer;

