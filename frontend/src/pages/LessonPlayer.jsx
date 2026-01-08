import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { lessonService } from '../services/lessonService';
import { courseService } from '../services/courseService';
import useAuthStore from '../store/authStore';
import Loading from '../components/common/Loading';
import Button from '../components/common/Button';
import VideoPlayer from '../components/video/VideoPlayer';

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
  const [lastSavedTime, setLastSavedTime] = useState(0);
  const [allLessons, setAllLessons] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  useEffect(() => {
    const loadLesson = async () => {
      try {
        const lessonData = await lessonService.getLessonById(id);
        setLesson(lessonData);

        const video = await lessonService.getVideoUrl(id);
        setVideoData(video);

        // Load all lessons for navigation
        if (lessonData.courseId) {
          const courseId = lessonData.courseId._id || lessonData.courseId;
          const lessons = await courseService.getCourseLessons(courseId);
          setAllLessons(lessons);
          const idx = lessons.findIndex(l => (l._id || l.id) === id);
          setCurrentIndex(idx);
        }
      } catch (error) {
        console.error('Error loading lesson:', error);
        toast.error('Хичээл ачаалахад алдаа гарлаа');
      } finally {
        setIsLoading(false);
      }
    };

    loadLesson();
  }, [id]);

  // Save progress to server
  const saveProgress = useCallback(async (currentTime, completed = false) => {
    try {
      await lessonService.updateProgress(id, {
        watchedDuration: Math.floor(currentTime),
        isCompleted: completed,
      });
      setLastSavedTime(currentTime);
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  }, [id]);

  // Handle video time update
  const handleTimeUpdate = useCallback(({ currentTime, duration, percentage }) => {
    setWatchedDuration(Math.floor(currentTime));

    // Save progress every 30 seconds
    if (Math.floor(currentTime) - lastSavedTime >= 30) {
      saveProgress(currentTime, false);
    }

    // Mark as completed if watched 90%
    if (percentage >= 90 && !isCompleted) {
      setIsCompleted(true);
      saveProgress(currentTime, true);
      toast.success('🎉 Хичээл дууслаа!');
    }
  }, [lastSavedTime, isCompleted, saveProgress]);

  // Handle video ended
  const handleVideoEnded = useCallback(() => {
    if (!isCompleted) {
      setIsCompleted(true);
      saveProgress(watchedDuration, true);
      toast.success('🎉 Хичээл дууслаа!');
    }
  }, [isCompleted, saveProgress, watchedDuration]);

  // Navigation
  const goToLesson = (lessonId) => {
    navigate(`/lessons/${lessonId}`);
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      const prevLesson = allLessons[currentIndex - 1];
      goToLesson(prevLesson._id || prevLesson.id);
    }
  };

  const goToNext = () => {
    if (currentIndex < allLessons.length - 1) {
      const nextLesson = allLessons[currentIndex + 1];
      goToLesson(nextLesson._id || nextLesson.id);
    }
  };

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!lesson || !videoData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Хичээл олдсонгүй</p>
          <Button onClick={() => navigate(-1)}>Буцах</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate(`/courses/${lesson.courseId?._id || lesson.courseId}`)}
            className="text-white border-white/30 hover:bg-white/10"
          >
            ← {t('common.back') || 'Буцах'}
          </Button>
          
          <div className="flex items-center gap-2">
            {isCompleted && (
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Дууссан
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Video Player */}
            <div className="mb-6">
              <VideoPlayer
                src={videoData.videoUrl}
                poster={lesson.thumbnailUrl}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleVideoEnded}
                initialTime={videoData.lastWatchedTime || 0}
              />
            </div>

            {/* Lesson Info */}
            <div className="bg-white/5 backdrop-blur rounded-xl p-6 mb-6">
              <h1 className="text-2xl font-bold text-white mb-3">{lesson.title}</h1>
              {lesson.description && (
                <p className="text-gray-300 mb-4">{lesson.description}</p>
              )}

              {/* Progress Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>
                    {formatTime(watchedDuration)}
                    {videoData.videoDuration && ` / ${formatTime(videoData.videoDuration)}`}
                  </span>
                </div>
                
                {lesson.quizId && (
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/lessons/${id}/quiz`)}
                    className="text-blue-400 border-blue-400/50 hover:bg-blue-400/10"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Шалгалт авах
                  </Button>
                )}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button
                variant="secondary"
                onClick={goToPrevious}
                disabled={currentIndex <= 0}
                className="disabled:opacity-50"
              >
                ← Өмнөх хичээл
              </Button>
              <Button
                onClick={goToNext}
                disabled={currentIndex >= allLessons.length - 1}
                className="disabled:opacity-50"
              >
                Дараагийн хичээл →
              </Button>
            </div>
          </div>

          {/* Sidebar - Lessons List */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur rounded-xl p-4 sticky top-4">
              <h3 className="text-lg font-semibold text-white mb-4">
                Хичээлүүд ({allLessons.length})
              </h3>
              
              <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                {allLessons.map((lessonItem, index) => {
                  const lessonId = lessonItem._id || lessonItem.id;
                  const isCurrent = lessonId === id;
                  
                  return (
                    <button
                      key={lessonId}
                      onClick={() => goToLesson(lessonId)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        isCurrent
                          ? 'bg-blue-500/20 border border-blue-500/50'
                          : 'hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                          isCurrent ? 'bg-blue-500 text-white' : 'bg-white/10 text-gray-400'
                        }`}>
                          {index + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${
                            isCurrent ? 'text-white' : 'text-gray-300'
                          }`}>
                            {lessonItem.title}
                          </p>
                          {lessonItem.videoDuration && (
                            <p className="text-xs text-gray-500">
                              {formatTime(lessonItem.videoDuration)}
                            </p>
                          )}
                        </div>
                        {lessonItem.isCompleted && (
                          <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Keyboard Shortcuts Help */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-xs">
            Товчлуур: Space - тоглуулах/зогсоох | ← → - 10 сек | F - бүтэн дэлгэц | M - дуу хаах
          </p>
        </div>
      </div>
    </div>
  );
};

export default LessonPlayer;
