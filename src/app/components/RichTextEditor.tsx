'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { 
  ssr: false,
  loading: () => <div className="border border-gray-300 rounded-md h-64 flex items-center justify-center bg-gray-50">Loading editor...</div>
});

// Import Quill styles
import 'react-quill-new/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: number;
  className?: string;
  error?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Enter description...",
  height = 300,
  className = "",
  error
}) => {
  // Toolbar configuration with essential formatting options
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['link'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false,
    }
  }), []);

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'color', 'background', 'align'
  ];

  return (
    <div className={`${className} rich-text-editor`}>
      <style jsx global>{`
        .rich-text-editor .ql-container {
          border: 1px solid #d1d5db !important;
          border-radius: 0 0 0.375rem 0.375rem !important;
          font-family: inherit !important;
        }
        .rich-text-editor .ql-toolbar {
          border: 1px solid #d1d5db !important;
          border-bottom: none !important;
          border-radius: 0.375rem 0.375rem 0 0 !important;
          background: #f9fafb !important;
        }
        .rich-text-editor .ql-editor {
          min-height: ${height - 42}px !important;
          font-size: 14px !important;
          line-height: 1.5 !important;
          padding: 12px 15px !important;
        }
        .rich-text-editor .ql-editor.ql-blank::before {
          color: #9ca3af !important;
          font-style: normal !important;
          left: 15px !important;
          right: 15px !important;
        }
        .rich-text-editor .ql-toolbar .ql-formats {
          margin-right: 8px !important;
        }
        .rich-text-editor .ql-snow .ql-tooltip {
          z-index: 1000 !important;
        }
        /* Focus styles */
        .rich-text-editor .ql-container.ql-snow {
          border-color: #d1d5db !important;
        }
        .rich-text-editor:focus-within .ql-container.ql-snow {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 1px #3b82f6 !important;
        }
        .rich-text-editor:focus-within .ql-toolbar.ql-snow {
          border-color: #3b82f6 !important;
        }
        /* Error styles */
        .rich-text-editor.error .ql-container.ql-snow,
        .rich-text-editor.error .ql-toolbar.ql-snow {
          border-color: #ef4444 !important;
        }
        /* List styles */
        .rich-text-editor .ql-editor ul[data-checked=true],
        .rich-text-editor .ql-editor ul[data-checked=false] {
          pointer-events: none;
        }
        .rich-text-editor .ql-editor li[data-list=checked],
        .rich-text-editor .ql-editor li[data-list=unchecked] {
          pointer-events: all;
        }
      `}</style>
      
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
      
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default RichTextEditor; 