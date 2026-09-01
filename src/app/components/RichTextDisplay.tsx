'use client';

interface RichTextDisplayProps {
  content: string;
  className?: string;
}

const RichTextDisplay: React.FC<RichTextDisplayProps> = ({ content, className = "" }) => {
  if (!content) {
    return <div className={className}>No description available</div>;
  }

  // Basic HTML sanitization - remove dangerous tags
  const basicSanitized = content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');

  return (
    <div
      className={`prose prose-sm max-w-none ${className}`}
      style={{
        fontSize: '14px',
        lineHeight: '1.5'
      }}
      dangerouslySetInnerHTML={{ __html: basicSanitized }}
    />
  );
};

export default RichTextDisplay; 