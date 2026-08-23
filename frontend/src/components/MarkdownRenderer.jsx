import ReactMarkdown from 'react-markdown';

function MarkdownRenderer({ content }) {
  return (
    <div className="text-gray-700 leading-relaxed text-sm md:text-base">
      <ReactMarkdown
        components={{
          h1: ({node, ...props}) => <h1 className="text-2xl font-extrabold mt-6 mb-3 text-gray-900" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-xl font-bold mt-5 mb-2 text-gray-800" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-lg font-bold mt-4 mb-2 text-gray-800" {...props} />,
          p: ({node, ...props}) => <p className="mb-4" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 space-y-1" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4 space-y-1" {...props} />,
          li: ({node, ...props}) => <li className="" {...props} />,
          strong: ({node, ...props}) => <strong className="font-bold text-gray-900" {...props} />,
          em: ({node, ...props}) => <em className="italic text-gray-800" {...props} />,
          blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-blue-400 pl-4 italic bg-blue-50 py-2 rounded-r-lg my-4" {...props} />
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default MarkdownRenderer;
