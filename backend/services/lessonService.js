const lessonRepository = require('../repositories/lessonRepository');
const enrollmentRepository = require('../repositories/enrollmentRepository');
const courseRepository = require('../repositories/courseRepository');
const videoService = require('./videoService');

/**
 * Lesson Service
 * Business logic layer for lessons
 */
class LessonService {
  /**
   * Get lesson by ID
   */
  async getLessonById(id, userId = null) {
    const lesson = await lessonRepository.findById(id);

    if (!lesson) {
      throw new Error('Lesson not found');
    }

    // Check access permissions
    if (userId) {
      const isEnrolled = await courseRepository.isEnrolled(userId, lesson.course_id);
      const isPreview = lesson.is_preview;

      // If not enrolled and not preview, deny access
      if (!isEnrolled && !isPreview) {
        throw new Error('Access denied. Please enroll in the course to access this lesson.');
      }
    } else if (!lesson.is_preview) {
      // Not authenticated and not preview
      throw new Error('Authentication required to access this lesson');
    }

    return lesson;
  }

  /**
   * Get video URL (with access control)
   */
  async getVideoUrl(lessonId, userId) {
    const lesson = await this.getLessonById(lessonId, userId);

    // Generate signed URL for video CDN
    const signedUrl = await videoService.getVideoUrl(
      lesson.videoUrl || lesson._id.toString(),
      userId,
      lesson.courseId.toString()
    );

    return {
      videoUrl: signedUrl.videoUrl,
      videoDuration: lesson.videoDuration,
      expiresAt: signedUrl.expiresAt
    };
  }

  /**
   * Update lesson progress
   */
  async updateProgress(lessonId, userId, progressData) {
    const lesson = await lessonRepository.findById(lessonId);

    if (!lesson) {
      throw new Error('Lesson not found');
    }

    // Check enrollment
    const enrollment = await enrollmentRepository.findByUserAndCourse(
      userId,
      lesson.course_id
    );

    if (!enrollment) {
      throw new Error('User is not enrolled in this course');
    }

    // Update lesson progress
    const progress = await lessonRepository.upsertProgress(
      enrollment.id,
      lessonId,
      progressData
    );

    // Update course progress percentage
    await this.updateCourseProgress(enrollment._id.toString(), lesson.courseId.toString());

    return progress;
  }

  /**
   * Update course progress percentage
   */
  async updateCourseProgress(enrollmentId, courseId) {
    // Get total lessons count
    const lessons = await courseRepository.getLessons(courseId);
    const totalLessons = lessons.length;

    if (totalLessons === 0) return;

    // Get completed lessons count
    const LessonProgress = require('../repositories/lessonRepository');
    const Lesson = require('../models/Lesson');
    
    const lessonIds = lessons.map(l => l._id);
    const completedCount = await LessonProgress.lessonProgressModel.countDocuments({
      enrollmentId,
      lessonId: { $in: lessonIds },
      isCompleted: true
    });

    const progressPercentage = Math.round((completedCount / totalLessons) * 100);

    // Update enrollment progress
    await enrollmentRepository.updateProgress(enrollmentId, progressPercentage);

    // If 100% complete, mark course as completed
    if (progressPercentage === 100) {
      await enrollmentRepository.markCompleted(enrollmentId);
    }
  }

  /**
   * Get lesson quiz
   */
  async getQuiz(lessonId, userId) {
    const lesson = await this.getLessonById(lessonId, userId);

    // Check enrollment
    const enrollment = await enrollmentRepository.findByUserAndCourse(
      userId,
      lesson.course_id
    );

    if (!enrollment) {
      throw new Error('User is not enrolled in this course');
    }

    const quiz = await lessonRepository.getQuiz(lessonId);

    if (!quiz) {
      return null;
    }

    // Remove correct answers for security (only show in results)
    const quizForUser = {
      ...quiz,
      questions: quiz.questions.map(q => ({
        id: q.id,
        questionText: q.question_text,
        questionType: q.question_type,
        orderIndex: q.order_index,
        points: q.points,
        answers: q.answers.map(a => ({
          id: a.id,
          answerText: a.answerText,
          orderIndex: a.orderIndex
          // isCorrect is hidden
        }))
      }))
    };

    return quizForUser;
  }

  /**
   * Submit quiz attempt
   */
  async submitQuizAttempt(lessonId, userId, userAnswers) {
    const lesson = await this.getLessonById(lessonId, userId);

    // Check enrollment
    const enrollment = await enrollmentRepository.findByUserAndCourse(
      userId,
      lesson.course_id
    );

    if (!enrollment) {
      throw new Error('User is not enrolled in this course');
    }

    // Get quiz with correct answers
    const quiz = await lessonRepository.getQuiz(lessonId);

    if (!quiz) {
      throw new Error('Quiz not found for this lesson');
    }

    // Calculate score
    let correctCount = 0;
    let totalPoints = 0;
    let earnedPoints = 0;

    for (const question of quiz.questions) {
      totalPoints += question.points;
      const userAnswer = userAnswers[question.id];

      if (!userAnswer) continue;

      // Check if answer is correct
      const correctAnswer = question.answers.find(a => a.isCorrect);
      
      if (question.question_type === 'multiple_choice') {
        if (userAnswer === correctAnswer.id) {
          correctCount++;
          earnedPoints += question.points;
        }
      } else if (question.question_type === 'true_false') {
        if (userAnswer === correctAnswer.id) {
          correctCount++;
          earnedPoints += question.points;
        }
      } else if (question.question_type === 'short_answer') {
        // For short answer, do simple text comparison (can be improved)
        const userText = userAnswer.toLowerCase().trim();
        const correctText = correctAnswer.answerText.toLowerCase().trim();
        if (userText === correctText) {
          correctCount++;
          earnedPoints += question.points;
        }
      }
    }

    const score = totalPoints > 0 
      ? Math.round((earnedPoints / totalPoints) * 100) 
      : 0;
    const isPassed = score >= quiz.passing_score;

    // Save attempt
    const attempt = await lessonRepository.createQuizAttempt(
      enrollment.id,
      quiz.id,
      userAnswers,
      score,
      isPassed
    );

    return {
      attempt,
      score,
      isPassed,
      passingScore: quiz.passing_score,
      correctCount,
      totalQuestions: quiz.questions.length
    };
  }
}

module.exports = new LessonService();

