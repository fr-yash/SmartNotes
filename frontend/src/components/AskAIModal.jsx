import { useState } from 'react';

const AskAIModal = ({ note, onClose, onAskAI }) => {
  const [question, setQuestion] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userQuestion = question.trim();
    setQuestion('');
    setLoading(true);
    setError('');

    // Add user question to conversation
    const newConversation = [...conversation, { type: 'user', content: userQuestion }];
    setConversation(newConversation);

    try {
      const result = await onAskAI(note.content, userQuestion);
      setConversation([...newConversation, { type: 'ai', content: result.answer }]);
    } catch (error) {
      setError('Failed to get AI response. Please try again.');
      console.error('Error asking AI:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearConversation = () => {
    setConversation([]);
    setError('');
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border border-gray-600 w-full max-w-4xl bg-gray-800 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white">Ask AI about: {note.title}</h3>
            <p className="text-sm text-gray-400 mt-1">Ask any question about this note's content</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Conversation Area */}
        <div className="bg-gray-700 rounded-lg p-4 mb-4 h-96 overflow-y-auto">
          {conversation.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <div className="text-4xl mb-4">🤖</div>
                <p>Ask me anything about this note!</p>
                <p className="text-sm mt-2">I can help explain concepts, answer questions, or provide additional insights.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {conversation.map((message, index) => (
                <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-3xl rounded-lg p-3 ${
                    message.type === 'user' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-600 text-gray-100'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className="text-xs font-medium opacity-75">
                            {message.type === 'user' ? 'You' : 'AI Assistant'}
                          </span>
                        </div>
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">
                          {message.content}
                        </div>
                      </div>
                      {message.type === 'ai' && (
                        <button
                          onClick={() => copyToClipboard(message.content)}
                          className="ml-2 text-gray-300 hover:text-white text-xs p-1 rounded"
                          title="Copy response"
                        >
                          📋
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-600 text-gray-100 rounded-lg p-3 max-w-3xl">
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-300 mr-2"></div>
                      <span className="text-sm">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="flex space-x-3">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question about this note..."
              className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Asking...' : 'Ask'}
            </button>
          </div>
        </form>

        {/* Suggested Questions */}
        {conversation.length === 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-400 mb-2">Suggested questions:</p>
            <div className="flex flex-wrap gap-2">
              {[
                "What are the main points?",
                "Can you explain this in simpler terms?",
                "What are the key takeaways?",
                "How can I remember this better?",
                "What questions might be asked about this?"
              ].map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setQuestion(suggestion)}
                  className="text-xs px-3 py-1 bg-gray-700 text-gray-300 rounded-full hover:bg-gray-600 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            onClick={clearConversation}
            disabled={conversation.length === 0}
            className="px-4 py-2 text-sm text-gray-400 hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Clear Conversation
          </button>
          
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AskAIModal;
