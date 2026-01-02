const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const LessonProgress = require('../models/LessonProgress');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const QuizAttempt = require('../models/QuizAttempt');

/**
 * Lesson Repository
 * Data access layer for lessons
 */
class LessonRepository {
  /**
   * Get lesson by ID
   */
  async findById(id) {
    const lesson = await Lesson.findById(id)
      .populate({
        path: 'courseId',
        select: 'title instructorId'
      })
      .lean();

    return lesson;
  }

  /**
   * Get lesson progress
   */
  async getProgress(enrollmentId, lessonId) {
    return await LessonProgress.findOne({
      enrollmentId,
      lessonId
    });
  }

  /**
   * Create or update lesson progress
   */
  async upsertProgress(enrollmentId, lessonId, progressData) {
    const { watchedDuration, isCompleted } = progressData;

    const updateData = {
      watchedDuration: watchedDuration || 0,
      isCompleted: isCompleted || false
    };

    if (isCompleted) {
      updateData.completedAt = new Date();
    }

    return await LessonProgress.findOneAndUpdate(
      { enrollmentId, lessonId },
      { $set: updateData },
      { upsert: true, new: true }
    );
  }

  /**
   * Get lesson quiz
   */
  async getQuiz(lessonId) {
    const quiz = await Quiz.findOne({ lessonId }).lean();

    if (!quiz) return null;

    // Get questions with answers
    const questions = await Question.find({ quizId: quiz._id })
      .sort({ orderIndex: 1 })
      .lean();

    const questionIds = questions.map(q => q._id);
    const answers = await Answer.find({ questionId: { $in: questionIds } })
      .sort({ orderIndex: 1 })
      .lean();

    // Group answers by question
    const answersByQuestion = {};
    answers.forEach(answer => {
      if (!answersByQuestion[answer.questionId.toString()]) {
        answersByQuestion[answer.questionId.toString()] = [];
      }
      answersByQuestion[answer.questionId.toString()].push({
        id: answer._id,
        answerText: answer.answerText,
        isCorrect: answer.isCorrect,
        orderIndex: answer.orderIndex
      });
    });

    // Attach answers to questions
    quiz.questions = questions.map(question => ({
      ...question,
      answers: answersByQuestion[question._id.toString()] || []
    }));

    return quiz;
  }

  /**
   * Get quiz attempt
   */
  async getQuizAttempt(enrollmentId, quizId) {
    return await QuizAttempt.findOne({
      enrollmentId,
      quizId
    })
      .sort({ startedAt: -1 })
      .lean();
  }

  /**
   * Create quiz attempt
   */
  async createQuizAttempt(enrollmentId, quizId, answers, score, isPassed) {
    const attempt = new QuizAttempt({
      enrollmentId,
      quizId,
      answers,
      score,
      isPassed,
      completedAt: new Date()
    });

    return await attempt.save();
  }
}

module.exports = new LessonRepository();
