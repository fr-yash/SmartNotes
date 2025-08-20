import { useState, useEffect } from 'react';
import { notesAPI, aiAPI } from '../services/api';
import NoteCard from '../components/NoteCard';
import CreateNoteModal from '../components/CreateNoteModal';
import EditNoteModal from '../components/EditNoteModal';
import AIResultModal from '../components/AIResultModal';
import QuizModal from '../components/QuizModal';
import AskAIModal from '../components/AskAIModal';
import LoadingSpinner from '../components/LoadingSpinner';
import ViewNoteModal from '../components/ViewNoteModal';

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [quizNote, setQuizNote] = useState(null);
  const [askAINote, setAskAINote] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const data = await notesAPI.getAll();
      setNotes(data);
    } catch (error) {
      setError('Failed to fetch notes');
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async (noteData) => {
    try {
      const newNote = await notesAPI.create(noteData);
      setNotes(prev => [newNote, ...prev]);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating note:', error);
      throw error;
    }
  };

  const handleUpdateNote = async (id, noteData) => {
    try {
      const updatedNote = await notesAPI.update(id, noteData);
      setNotes(prev => prev.map(note => note._id === id ? updatedNote : note));
      setEditingNote(null);
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  };

  const handleDeleteNote = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;

    try {
      await notesAPI.delete(id);
      setNotes(prev => prev.filter(note => note._id !== id));
    } catch (error) {
      console.error('Error deleting note:', error);
      setError('Failed to delete note');
    }
  };

  const handleAIAction = async (action, content, noteTitle) => {
    try {
      setAiLoading(true);
      let result;

      switch (action) {
        case 'summarize':
          result = await aiAPI.summarize(content);
          setAiResult({
            title: `Summary of "${noteTitle}"`,
            content: result.summary,
            type: 'summary'
          });
          break;
        case 'keywords':
          result = await aiAPI.extractKeywords(content);
          setAiResult({
            title: `Keywords from "${noteTitle}"`,
            content: result.keywords,
            type: 'keywords'
          });
          break;
        case 'rewrite':
          result = await aiAPI.rewrite(content);
          setAiResult({
            title: `Rewritten "${noteTitle}"`,
            content: result.rewritten,
            type: 'rewrite'
          });
          break;
        default:
          throw new Error('Unknown AI action');
      }
    } catch (error) {
      console.error('Error with AI action:', error);
      setError(`Failed to ${action} note`);
    } finally {
      setAiLoading(false);
    }
  };

  const handleGenerateQuiz = async (content) => {
    return await aiAPI.generateQuiz(content);
  };

  const handleAskAI = async (content, question) => {
    return await aiAPI.askAI(content, question);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-sm text-gray-600">Loading your notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Notes</h1>
            <p className="mt-2 text-gray-600">
              {notes.length} {notes.length === 1 ? 'note' : 'notes'} total
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <span className="mr-2">➕</span>
            Create Note
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {notes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notes yet</h3>
            <p className="text-gray-500 mb-6">Get started by creating your first note</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Create your first note
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onEdit={() => setEditingNote(note)}
                onDelete={() => handleDeleteNote(note._id)}
                onQuiz={() => setQuizNote(note)}
                onAskAI={() => setAskAINote(note)}
                onAIAction={handleAIAction}
                aiLoading={aiLoading}
              />
            ))}
          </div>
        )}

        {/* Modals */}
        {showCreateModal && (
          <CreateNoteModal
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreateNote}
          />
        )}

        {editingNote && (
          <EditNoteModal
            note={editingNote}
            onClose={() => setEditingNote(null)}
            onSubmit={(noteData) => handleUpdateNote(editingNote._id, noteData)}
          />
        )}

        {quizNote && (
          <QuizModal
            note={quizNote}
            onClose={() => setQuizNote(null)}
            onGenerateQuiz={handleGenerateQuiz}
            loading={aiLoading}
          />
        )}

        {askAINote && (
          <AskAIModal
            note={askAINote}
            onClose={() => setAskAINote(null)}
            onAskAI={handleAskAI}
          />
        )}

        {aiResult && (
          <AIResultModal
            result={aiResult}
            onClose={() => setAiResult(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
