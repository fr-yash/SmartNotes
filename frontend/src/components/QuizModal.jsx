import { useState, useEffect } from 'react';

const QuizModal = ({ note, onClose, onGenerateQuiz, loading }) => {
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [quizLoading, setQuizLoading] = useState(false);

  useEffect(() => {
    generateQuiz();
  }, []);

  const generateQuiz = async () => {
    setQuizLoading(true);
    try {
      const result = await onGenerateQuiz(note.content);

      // Handle different response formats
      let questions = null;
      if (result.quiz && result.quiz.questions) {
        questions = result.quiz.questions;
      } else if (result.questions) {
        questions = result.questions;
      } else {
        throw new Error('Invalid quiz format received');
      }

      setQuiz(questions);
      setUserAnswers(new Array(questions.length).fill(null));
    } catch (error) {
      console.error('Error generating quiz:', error);
      setQuiz(null);
    } finally {
      setQuizLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setUserAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    let correctCount = 0;
    quiz.forEach((question, index) => {
      if (userAnswers[index] === question.correctIndex) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setShowResults(true);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setUserAnswers(new Array(quiz.length).fill(null));
    setShowResults(false);
    setScore(0);
  };

  if (quizLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-5 border border-gray-600 w-full max-w-2xl bg-gray-800 rounded-lg shadow-lg">
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
              <p className="text-white">Generating quiz questions...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-5 border border-gray-600 w-full max-w-2xl bg-gray-800 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Quiz Generation Failed</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-200 text-2xl font-bold">×</button>
          </div>
          <div className="text-center py-8">
            <p className="text-gray-300 mb-4">Failed to generate quiz questions. Please try again.</p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={generateQuiz}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Try Again
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-5 border border-gray-600 w-full max-w-4xl bg-gray-800 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold text-white">Quiz Results</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-200 text-2xl font-bold">×</button>
          </div>

          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-white mb-2">
              {score}/{quiz.length}
            </div>
            <div className="text-lg text-gray-300">
              Score: {Math.round((score / quiz.length) * 100)}%
            </div>
            <div className={`text-sm mt-2 ${score >= quiz.length * 0.8 ? 'text-green-400' : score >= quiz.length * 0.6 ? 'text-yellow-400' : 'text-red-400'}`}>
              {score >= quiz.length * 0.8 ? 'Excellent!' : score >= quiz.length * 0.6 ? 'Good job!' : 'Keep studying!'}
            </div>
          </div>

          <div className="space-y-6 max-h-96 overflow-y-auto">
            {quiz.map((question, index) => (
              <div key={index} className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-start mb-3">
                  <span className="text-sm font-medium text-gray-300 mr-2">Q{index + 1}:</span>
                  <p className="text-white">{question.question}</p>
                </div>
                
                <div className="space-y-2 mb-3">
                  {question.options.map((option, optionIndex) => (
                    <div
                      key={optionIndex}
                      className={`p-2 rounded text-sm ${
                        optionIndex === question.correctIndex
                          ? 'bg-green-600 text-white'
                          : userAnswers[index] === optionIndex
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-600 text-gray-200'
                      }`}
                    >
                      {String.fromCharCode(65 + optionIndex)}. {option}
                      {optionIndex === question.correctIndex && ' ✓'}
                      {userAnswers[index] === optionIndex && optionIndex !== question.correctIndex && ' ✗'}
                    </div>
                  ))}
                </div>
                
                {userAnswers[index] !== question.correctIndex && (
                  <div className="bg-blue-900 p-3 rounded text-sm text-blue-200">
                    <strong>Explanation:</strong> {question.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-center space-x-3 mt-6">
            <button
              onClick={resetQuiz}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Retake Quiz
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = quiz[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.length) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border border-gray-600 w-full max-w-2xl bg-gray-800 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-white">Quiz: {note.title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200 text-2xl font-bold">×</button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-300 mb-2">
            <span>Question {currentQuestion + 1} of {quiz.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div className="bg-indigo-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        {/* Question */}
        <div className="mb-6">
          <h4 className="text-lg text-white mb-4">{currentQ.question}</h4>
          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  userAnswers[currentQuestion] === index
                    ? 'bg-indigo-600 border-indigo-500 text-white'
                    : 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600'
                }`}
              >
                <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <div className="flex space-x-3">
            {currentQuestion === quiz.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={userAnswers.includes(null)}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={userAnswers[currentQuestion] === null}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizModal;
