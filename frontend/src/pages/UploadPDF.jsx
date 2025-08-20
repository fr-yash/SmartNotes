import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { pdfAPI, aiAPI } from '../services/api';
import AIResultModal from '../components/AIResultModal';

const UploadPDF = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const [extractedNote, setExtractedNote] = useState(null);
  const [error, setError] = useState('');
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please select a valid PDF file');
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a PDF file');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const response = await pdfAPI.upload(file);
      setExtractedText(response.text);
      setExtractedNote(response.note);
    } catch (error) {
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleAIAction = async (action) => {
    if (!extractedText) return;

    try {
      setAiLoading(true);
      let result;
      
      switch (action) {
        case 'summarize':
          result = await aiAPI.summarize(extractedText);
          setAiResult({
            title: `Summary of "${extractedNote?.title || 'PDF'}"`,
            content: result.summary,
            type: 'summary'
          });
          break;
        case 'keywords':
          result = await aiAPI.extractKeywords(extractedText);
          setAiResult({
            title: `Keywords from "${extractedNote?.title || 'PDF'}"`,
            content: result.keywords,
            type: 'keywords'
          });
          break;
        case 'rewrite':
          result = await aiAPI.rewrite(extractedText);
          setAiResult({
            title: `Rewritten "${extractedNote?.title || 'PDF'}"`,
            content: result.rewritten,
            type: 'rewrite'
          });
          break;
        default:
          throw new Error('Unknown AI action');
      }
    } catch (error) {
      setError(`Failed to ${action} PDF content`);
    } finally {
      setAiLoading(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setExtractedText('');
    setExtractedNote(null);
    setError('');
    setAiResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Upload PDF</h1>
          <p className="mt-2 text-gray-300">
            Upload a PDF file to extract its text and perform AI actions
          </p>
        </div>

        {!extractedText ? (
          <div className="bg-gray-800 rounded-lg shadow-md p-8">
            <div className="text-center">
              <div className="text-6xl mb-4">📄</div>
              <h3 className="text-lg font-medium text-white mb-2">
                Upload PDF Document
              </h3>
              <p className="text-gray-300 mb-6">
                Select a PDF file to extract its text content
              </p>

              <div className="max-w-md mx-auto">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                
                {file && (
                  <div className="mt-4 p-3 bg-gray-700 rounded-md">
                    <p className="text-sm text-gray-200">
                      Selected: <span className="font-medium">{file.name}</span>
                    </p>
                    <p className="text-xs text-gray-400">
                      Size: {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                )}

                {error && (
                  <div className="mt-4 p-3 bg-red-900 rounded-md">
                    <p className="text-sm text-red-200">{error}</p>
                  </div>
                )}

                <button
                  onClick={handleUpload}
                  disabled={!file || uploading}
                  className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Extracting text...
                    </div>
                  ) : (
                    'Upload and Extract Text'
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Success Message */}
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-green-400 text-xl">✅</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    PDF processed successfully!
                  </h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>
                      Text extracted and saved as a note: "{extractedNote?.title}"
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                What would you like to do next?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <span className="mr-2">📊</span>
                  View Dashboard
                </button>
                <button
                  onClick={() => handleAIAction('summarize')}
                  disabled={aiLoading}
                  className="flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  <span className="mr-2">📝</span>
                  Summarize
                </button>
                <button
                  onClick={() => handleAIAction('keywords')}
                  disabled={aiLoading}
                  className="flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                >
                  <span className="mr-2">🏷️</span>
                  Extract Keywords
                </button>
                <button
                  onClick={() => handleAIAction('rewrite')}
                  disabled={aiLoading}
                  className="flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
                >
                  <span className="mr-2">✨</span>
                  Rewrite
                </button>
              </div>
            </div>

            {/* Extracted Text Preview */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Extracted Text Preview
                </h3>
                <button
                  onClick={resetUpload}
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  Upload Another PDF
                </button>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                  {extractedText.substring(0, 2000)}
                  {extractedText.length > 2000 && '...'}
                </pre>
              </div>
              {extractedText.length > 2000 && (
                <p className="mt-2 text-sm text-gray-500">
                  Showing first 2000 characters. Full text has been saved to your notes.
                </p>
              )}
            </div>
          </div>
        )}

        {/* AI Result Modal */}
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

export default UploadPDF;
