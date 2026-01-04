import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { lessonService } from '../services/lessonService';
import Loading from '../components/common/Loading';
import Button from '../components/common/Button';

const Quiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const quizData = await lessonService.getQuiz(id);
        setQuiz(quizData);
      } catch (error) {
        console.error('Error loading quiz:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuiz();
  }, [id]);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await lessonService.submitQuiz(id, answers);
      setResult(result);
    } catch (error) {
      console.error('Error submitting quiz:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!quiz) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-500">Шалгалт олдсонгүй</p>
      </div>
    );
  }

  if (result) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">{t('quiz.title')}</h1>
          
          <div className="text-center mb-8">
            <div className={`text-4xl font-bold mb-2 ${result.isPassed ? 'text-green-600' : 'text-red-600'}`}>
              {result.score}%
            </div>
            <p className={`text-xl font-semibold ${result.isPassed ? 'text-green-600' : 'text-red-600'}`}>
              {result.isPassed ? t('quiz.passed') : t('quiz.failed')}
            </p>
            <p className="text-gray-600 mt-2">
              {t('quiz.passingScore')}: {result.passingScore}%
            </p>
            <p className="text-gray-600">
              {result.correctCount} / {result.totalQuestions} {t('quiz.correct')}
            </p>
          </div>

          <div className="flex space-x-4">
            <Button onClick={() => navigate(`/lessons/${id}`)} className="flex-1">
              {t('common.back')}
            </Button>
            <Button variant="outline" onClick={() => setResult(null)} className="flex-1">
              Дахин оролдох
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">{quiz.title}</h1>
        {quiz.description && (
          <p className="text-gray-600 mb-6">{quiz.description}</p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 mb-8">
            {quiz.questions.map((question, index) => (
              <div key={question.id} className="border rounded-lg p-6">
                <div className="mb-4">
                  <span className="text-sm text-gray-500">
                    {index + 1} / {quiz.questions.length}
                  </span>
                  <h3 className="text-lg font-semibold mt-2">{question.questionText}</h3>
                  <p className="text-sm text-gray-500">
                    {question.points} {question.points === 1 ? 'оноо' : 'оноо'}
                  </p>
                </div>

                <div className="space-y-2">
                  {question.questionType === 'multiple_choice' && question.answers.map((answer) => (
                    <label
                      key={answer.id}
                      className="flex items-center p-3 border rounded hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={answer.id}
                        checked={answers[question.id] === answer.id}
                        onChange={() => handleAnswerChange(question.id, answer.id)}
                        className="mr-3"
                      />
                      <span>{answer.answerText}</span>
                    </label>
                  ))}

                  {question.questionType === 'true_false' && question.answers.map((answer) => (
                    <label
                      key={answer.id}
                      className="flex items-center p-3 border rounded hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={answer.id}
                        checked={answers[question.id] === answer.id}
                        onChange={() => handleAnswerChange(question.id, answer.id)}
                        className="mr-3"
                      />
                      <span>{answer.answerText}</span>
                    </label>
                  ))}

                  {question.questionType === 'short_answer' && (
                    <input
                      type="text"
                      value={answers[question.id] || ''}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="Хариултаа оруулна уу"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              className="flex-1"
            >
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? t('common.loading') : t('quiz.submit')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Quiz;

