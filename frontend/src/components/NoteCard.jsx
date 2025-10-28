import { useState, useEffect, useRef } from 'react';
import { aiAPI } from '../services/api';

const NoteCard = ({ note, onEdit, onDelete, onAIAction, onQuiz, onAskAI, aiLoading, onOpenSummary }) => {
  const [actionLoading, setActionLoading] = useState(null);
  const [showMoreActions, setShowMoreActions] = useState(false);
  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [fullSummary, setFullSummary] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowMoreActions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Generate summary on component mount
  useEffect(() => {
    const generateSummary = async () => {
      try {
        setSummaryLoading(true);
        const result = await aiAPI.summarize(note.content);
        setFullSummary(result.summary);

        // Extract just the first section (Detailed Summary) for preview
        const summaryMatch = result.summary.match(/### 1\) Detailed Summary\n([\s\S]*?)(?=### 2\)|$)/);
        if (summaryMatch) {
          setSummary(summaryMatch[1].trim());
        } else {
          setSummary(result.summary);
        }
      } catch (error) {
        console.error('Error generating summary:', error);
        setSummary(null);
        setFullSummary(null);
      } finally {
        setSummaryLoading(false);
      }
    };

    generateSummary();
  }, [note._id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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

  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const handleCardClick = (e) => {
    // Don't open summary if clicking on buttons or dropdown
    if (e.target.closest('button') || e.target.closest('[role="button"]')) {
      return;
    }

    // Open summary modal if we have the full summary
    if (fullSummary && onOpenSummary) {
      onOpenSummary({
        title: `Summary of "${note.title}"`,
        content: fullSummary,
        type: 'summary'
      });
    }
  };

  return (
    <div
      className="bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-6 relative cursor-pointer"
      onClick={handleCardClick}
    >

      {/* Note Header */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-white truncate pr-2">
          {note.title}
        </h3>
        {/* Quick Actions - Always visible */}
        <div className="flex space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuiz();
            }}
            className="p-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700 transition-colors"
            title="Quiz"
          >
            🧠
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAskAI();
            }}
            className="p-1 bg-cyan-600 text-white text-xs rounded hover:bg-cyan-700 transition-colors"
            title="Ask AI"
          >
            🤖
          </button>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMoreActions(!showMoreActions);
              }}
              className="p-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
              title="More Actions"
            >
              ⋯
            </button>
            {showMoreActions && (
              <div className="absolute right-0 top-8 bg-gray-700 rounded-md shadow-lg z-30 min-w-32 border border-gray-600">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAIAction('summarize');
                    setShowMoreActions(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-xs text-white hover:bg-gray-600 rounded-t-md"
                >
                  📝 Summarize
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAIAction('keywords');
                    setShowMoreActions(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-xs text-white hover:bg-gray-600"
                >
                  🏷️ Keywords
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAIAction('rewrite');
                    setShowMoreActions(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-xs text-white hover:bg-gray-600"
                >
                  ✨ Rewrite
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                    setShowMoreActions(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-red-900 rounded-b-md"
                >
                  🗑️ Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Note Content - Show Summary */}
      <div className="mb-4">
        {summaryLoading ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-indigo-400"></div>
            <p className="text-gray-400 text-sm italic">Generating summary...</p>
          </div>
        ) : summary ? (
          <p className="text-gray-300 text-sm leading-relaxed">
            {truncateContent(summary, 200)}
          </p>
        ) : (
          <p className="text-gray-400 text-sm italic">
            Summary unavailable. Original content:
          </p>
        )}
        {!summaryLoading && !summary && (
          <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap mt-2">
            {truncateContent(note.content, 150)}
          </p>
        )}
      </div>

      {/* Note Footer */}
      <div className="flex justify-between items-center text-xs text-gray-400">
        <span>Created {formatDate(note.createdAt)}</span>
        {note.updatedAt !== note.createdAt && (
          <span>Updated {formatDate(note.updatedAt)}</span>
        )}
      </div>

      {/* Loading Overlay */}
      {(aiLoading || actionLoading) && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center rounded-lg z-10">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-400"></div>
            <span className="text-sm text-white">Processing...</span>
          </div>
        </div>
      )}


    </div>
  );
};

export default NoteCard;
