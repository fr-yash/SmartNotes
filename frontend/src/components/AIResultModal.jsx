import { useState } from 'react';

const AIResultModal = ({ result, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const getIcon = () => {
    switch (result.type) {
      case 'summary':
        return '📝';
      case 'keywords':
        return '🏷️';
      case 'rewrite':
        return '✨';
      default:
        return '🤖';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border border-gray-600 w-full max-w-2xl bg-gray-800 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <span className="text-2xl mr-3">{getIcon()}</span>
            <h3 className="text-lg font-semibold text-white">{result.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="mb-6">
          <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium text-gray-300">AI Result:</span>
              <button
                onClick={handleCopy}
                className={`text-sm px-3 py-1 rounded-md transition-colors ${
                  copied
                    ? 'bg-green-800 text-green-200'
                    : 'bg-gray-600 text-gray-200 hover:bg-gray-500'
                }`}
              >
                {copied ? '✓ Copied!' : '📋 Copy'}
              </button>
            </div>
            <div className="text-gray-200 whitespace-pre-wrap leading-relaxed">
              {result.content}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIResultModal;
