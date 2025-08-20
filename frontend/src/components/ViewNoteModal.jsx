import { useState } from 'react';

const ViewNoteModal = ({ note, onClose, onEdit, onDelete, onAIAction, aiLoading }) => {
  const [actionLoading, setActionLoading] = useState(null);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleAIAction = async (action) => {
    setActionLoading(action);
    try {
      await onAIAction(action, note.content, note.title);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(note.content);
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border border-gray-600 w-full max-w-4xl bg-gray-800 rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1 mr-4">
            <h2 className="text-2xl font-bold text-white mb-2">{note.title}</h2>
            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
              <span>Created: {formatDate(note.createdAt)}</span>
              {note.updatedAt !== note.createdAt && (
                <span>Updated: {formatDate(note.updatedAt)}</span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-white">Content</h3>
              <button
                onClick={handleCopy}
                className="text-sm px-3 py-1 bg-gray-600 text-gray-200 hover:bg-gray-500 rounded-md transition-colors"
              >
                📋 Copy
              </button>
            </div>
            <div className="prose max-w-none">
              <pre className="text-gray-200 whitespace-pre-wrap font-sans leading-relaxed">
                {note.content}
              </pre>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => {
              onEdit();
              onClose();
            }}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <span className="mr-2">✏️</span>
            Edit Note
          </button>
          
          <button
            onClick={() => {
              onDelete();
              onClose();
            }}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <span className="mr-2">🗑️</span>
            Delete Note
          </button>

          <div className="flex-1"></div>

          {/* AI Actions */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleAIAction('summarize')}
              disabled={aiLoading || actionLoading}
              className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <span className="mr-2">📝</span>
              {actionLoading === 'summarize' ? 'Summarizing...' : 'Summarize'}
            </button>
            
            <button
              onClick={() => handleAIAction('keywords')}
              disabled={aiLoading || actionLoading}
              className="flex items-center px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <span className="mr-2">🏷️</span>
              {actionLoading === 'keywords' ? 'Extracting...' : 'Keywords'}
            </button>
            
            <button
              onClick={() => handleAIAction('rewrite')}
              disabled={aiLoading || actionLoading}
              className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <span className="mr-2">✨</span>
              {actionLoading === 'rewrite' ? 'Rewriting...' : 'Rewrite'}
            </button>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm font-medium text-gray-200 bg-gray-600 hover:bg-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Close
          </button>
        </div>

        {/* Loading Overlay */}
        {(aiLoading || actionLoading) && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
              <span className="text-sm text-gray-600">Processing...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewNoteModal;
