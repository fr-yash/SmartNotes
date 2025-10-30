import { useState } from 'react';

const SummaryResultModal = ({ result, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');

  // Parse the structured summary into sections
  const parseSummary = (text) => {
    const sections = {
      summary: '',
      teacher: '',
      notes: '',
      questions: ''
    };

    const summaryMatch = text.match(/### 1\) Detailed Summary\n([\s\S]*?)(?=### 2\)|$)/);
    const teacherMatch = text.match(/### 2\) Teacher Explanation.*?\n([\s\S]*?)(?=### 3\)|$)/);
    const notesMatch = text.match(/### 3\) Study Notes.*?\n([\s\S]*?)(?=### 4\)|$)/);
    const questionsMatch = text.match(/### 4\) Possible Questions\n([\s\S]*?)$/);

    if (summaryMatch) sections.summary = summaryMatch[1].trim();
    if (teacherMatch) sections.teacher = teacherMatch[1].trim();
    if (notesMatch) sections.notes = notesMatch[1].trim();
    if (questionsMatch) sections.questions = questionsMatch[1].trim();

    return sections;
  };

  const sections = parseSummary(result.content);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const renderContent = (text) => {
    return text.split('\n').map((line, idx) => {
      const trimmedLine = line.trim();

      // Skip empty lines
      if (!trimmedLine) {
        return <div key={idx} className="mb-2" />;
      }

      // Handle headings (##, ###, etc.)
      if (trimmedLine.startsWith('##')) {
        return (
          <h3 key={idx} className="text-lg font-bold text-gray-900 mt-4 mb-2">
            {trimmedLine.replace(/^#+\s*/, '')}
          </h3>
        );
      }

      // Handle bullet points (- or * at start)
      if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
        const content = trimmedLine.replace(/^[-*]\s*/, '');
        return (
          <div key={idx} className="flex gap-3 mb-2 ml-2">
            <span className="text-blue-500 font-bold">•</span>
            <span className="text-gray-700">{renderInlineFormatting(content)}</span>
          </div>
        );
      }

      // Handle numbered lists
      if (trimmedLine.match(/^\d+\.\s/)) {
        const content = trimmedLine.replace(/^\d+\.\s*/, '');
        return (
          <p key={idx} className="text-gray-700 mb-2 ml-2">
            {renderInlineFormatting(trimmedLine)}
          </p>
        );
      }

      // Handle bold text (standalone lines with **)
      if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
        return (
          <p key={idx} className="text-blue-600 font-semibold mb-3 mt-2">
            {trimmedLine.replace(/\*\*/g, '')}
          </p>
        );
      }

      // Regular paragraph with inline formatting
      return (
        <p key={idx} className="text-gray-700 mb-2 leading-relaxed">
          {renderInlineFormatting(trimmedLine)}
        </p>
      );
    });
  };

  const renderInlineFormatting = (text) => {
    // Handle **bold** text
    const parts = text.split(/(\*\*[^*]+\*\*)/);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={idx} className="text-blue-600 font-semibold">
            {part.replace(/\*\*/g, '')}
          </strong>
        );
      }
      return part;
    });
  };

  const tabs = [
    { id: 'summary', label: '📝 Detailed Summary', content: sections.summary },
    { id: 'teacher', label: '👨‍🏫 Teacher Explanation', content: sections.teacher },
    { id: 'notes', label: '📚 Study Notes', content: sections.notes },
    { id: 'questions', label: '❓ Questions', content: sections.questions }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 overflow-y-auto h-full w-full z-50 backdrop-blur-sm">
      <div className="relative top-10 mx-auto p-6 border border-gray-200 w-full max-w-4xl bg-white rounded-2xl shadow-xl mb-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <span className="text-3xl mr-3">📖</span>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Comprehensive Summary</h3>
              <p className="text-sm text-gray-500 mt-1">Detailed Summary • Teacher Explanation • Study Notes • Questions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-3xl font-bold transition-colors"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-6 max-h-96 overflow-y-auto">
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-medium text-gray-700">
              {tabs.find(t => t.id === activeTab)?.label}
            </span>
            <button
              onClick={handleCopy}
              className={`text-sm px-3 py-1 rounded-lg transition-colors ${
                copied
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {copied ? '✓ Copied!' : '📋 Copy'}
            </button>
          </div>
          <div className="text-gray-700 leading-relaxed">
            {sections[activeTab] ? (
              <div className="space-y-2">
                {renderContent(sections[activeTab])}
              </div>
            ) : (
              <p className="text-gray-500 italic">No content available for this section.</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3">
          <button
            onClick={handleCopy}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
          >
            📋 Copy All
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SummaryResultModal;

