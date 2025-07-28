import React from 'react';

interface SidebarProps {
  questions: string[];
  onSelect: (question: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ questions, onSelect }) => {
  return (
    <div className="w-64 bg-white/10 text-white p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-2">Previous Questions</h2>
      <ul className="space-y-2">
        {questions.map((q, idx) => (
          <li
            key={idx}
            onClick={() => onSelect(q)}
            className="cursor-pointer bg-white/5 hover:bg-white/10 p-2 rounded text-sm transition"
          >
            {q}
          </li>
        ))}
      </ul>
    </div>
  );
};
