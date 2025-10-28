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
          <h3 key={idx} className="text-lg font-bold text-white mt-4 mb-2">
            {trimmedLine.replace(/^#+\s*/, '')}
          </h3>
        );
      }

      // Handle bullet points (- or * at start)
      if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
        const content = trimmedLine.replace(/^[-*]\s*/, '');
        return (
          <div key={idx} className="flex gap-3 mb-2 ml-2">
            <span className="text-indigo-400 font-bold">•</span>
            <span className="text-gray-200">{renderInlineFormatting(content)}</span>
          </div>
        );
      }

      // Handle numbered lists
      if (trimmedLine.match(/^\d+\.\s/)) {
        const content = trimmedLine.replace(/^\d+\.\s*/, '');
        return (
          <p key={idx} className="text-gray-200 mb-2 ml-2">
            {renderInlineFormatting(trimmedLine)}
          </p>
        );
      }

      // Handle bold text (standalone lines with **)
      if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
        return (
          <p key={idx} className="text-indigo-300 font-semibold mb-3 mt-2">
            {trimmedLine.replace(/\*\*/g, '')}
          </p>
        );
      }

      // Regular paragraph with inline formatting
      return (
        <p key={idx} className="text-gray-200 mb-2 leading-relaxed">
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
          <strong key={idx} className="text-indigo-300 font-semibold">
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
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-6 border border-gray-600 w-full max-w-4xl bg-gray-800 rounded-lg shadow-lg mb-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <span className="text-3xl mr-3">📖</span>
            <div>
              <h3 className="text-2xl font-bold text-white">Comprehensive Summary</h3>
              <p className="text-sm text-gray-400 mt-1">Detailed Summary • Teacher Explanation • Study Notes • Questions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 text-3xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-600 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'text-indigo-400 border-b-2 border-indigo-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-gray-700 rounded-lg p-6 border border-gray-600 mb-6 max-h-96 overflow-y-auto">
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-medium text-gray-300">
              {tabs.find(t => t.id === activeTab)?.label}
            </span>
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
          <div className="text-gray-200 leading-relaxed">
            {sections[activeTab] ? (
              <div className="space-y-2">
                {renderContent(sections[activeTab])}
              </div>
            ) : (
              <p className="text-gray-400 italic">No content available for this section.</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3">
          <button
            onClick={handleCopy}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-600 hover:bg-gray-500 rounded-md transition-colors"
          >
            📋 Copy All
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SummaryResultModal;

