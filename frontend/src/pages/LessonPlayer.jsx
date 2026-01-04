import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { lessonService } from '../services/lessonService';
import { courseService } from '../services/courseService';
import useAuthStore from '../store/authStore';
import Loading from '../components/common/Loading';
import Button from '../components/common/Button';

const LessonPlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [lesson, setLesson] = useState(null);
  const [videoData, setVideoData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [watchedDuration, setWatchedDuration] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const videoRef = useRef(null);
  const progressIntervalRef = useRef(null);

  useEffect(() => {
    const loadLesson = async () => {
      try {
        const lessonData = await lessonService.getLessonById(id);
        setLesson(lessonData);

        const video = await lessonService.getVideoUrl(id);
        setVideoData(video);
      } catch (error) {
        console.error('Error loading lesson:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLesson();

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [id]);

  // Track video progress
  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;

    const updateProgress = async () => {
      if (video.readyState >= 2) {
        const currentTime = Math.floor(video.currentTime);
        setWatchedDuration(currentTime);

        // Update progress every 30 seconds
        if (currentTime % 30 === 0) {
          try {
            await lessonService.updateProgress(id, {
              watchedDuration: currentTime,
              isCompleted: video.ended,
            });
          } catch (error) {
            console.error('Error updating progress:', error);
          }
        }

        // Mark as completed when video ends
        if (video.ended && !isCompleted) {
          setIsCompleted(true);
          try {
            await lessonService.updateProgress(id, {
              watchedDuration: currentTime,
              isCompleted: true,
            });
          } catch (error) {
            console.error('Error marking as completed:', error);
          }
        }
      }
    };

    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('ended', () => {
      setIsCompleted(true);
      updateProgress();
    });

    return () => {
      video.removeEventListener('timeupdate', updateProgress);
      video.removeEventListener('ended', updateProgress);
    };
  }, [id, isCompleted]);

  const handleNext = () => {
    // Navigate to next lesson (implement based on course structure)
    navigate(-1);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!lesson || !videoData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-500">Хичээл олдсонгүй</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Button variant="outline" onClick={() => navigate(-1)}>
          {t('common.back')}
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-4">{lesson.title}</h1>
        {lesson.description && (
          <p className="text-gray-600 mb-6">{lesson.description}</p>
        )}

        {/* Video Player */}
        <div className="mb-6">
          <video
            ref={videoRef}
            src={videoData.videoUrl}
            controls
            className="w-full rounded-lg"
            style={{ maxHeight: '600px' }}
          >
            Таны браузер видео тоглуулахыг дэмждэггүй байна.
          </video>
        </div>

        {/* Progress Info */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-gray-600">
              {t('lesson.watchTime')}: {Math.floor(watchedDuration / 60)}:{(watchedDuration % 60).toString().padStart(2, '0')}
              {videoData.videoDuration && ` / ${Math.floor(videoData.videoDuration / 60)}:${(videoData.videoDuration % 60).toString().padStart(2, '0')}`}
            </p>
            {isCompleted && (
              <span className="text-green-600 font-semibold">
                ✓ {t('lesson.completed')}
              </span>
            )}
          </div>
          <Button onClick={handleNext}>
            {t('lesson.next')}
          </Button>
        </div>

        {/* Quiz Link */}
        {lesson.quizId && (
          <div className="mt-6 pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => navigate(`/lessons/${id}/quiz`)}
            >
              {t('lesson.quiz')} авах
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonPlayer;

