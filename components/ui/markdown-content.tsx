import Markdown from "react-markdown"
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface MarkdownContentProps {
  content: string
  className?: string
}

export function MarkdownContent({ content, className = "" }: MarkdownContentProps) {
  return (
    <div className={`prose prose-sm dark:prose-invert max-w-none ${className} prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-a:text-blue-600 prose-strong:font-semibold prose-ul:list-disc prose-ol:list-decimal`}>
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({node, ...props}) => <h1 className="text-2xl font-bold mt-6 mb-4" {...props}/>,
          h2: ({node, ...props}) => <h2 className="text-xl font-bold mt-5 mb-3" {...props}/>,
          h3: ({node, ...props}) => <h3 className="text-lg font-bold mt-4 mb-2" {...props}/>,
          p: ({node, ...props}) => <p className="my-2 leading-relaxed" {...props}/>,
          ul: ({node, ...props}) => <ul className="list-disc list-inside my-2" {...props}/>,
          ol: ({node, ...props}) => <ol className="list-decimal list-inside my-2" {...props}/>,
          li: ({node, ...props}) => <li className="my-1" {...props}/>,
          blockquote: ({node, ...props}) => (
            <blockquote className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 my-2 italic" {...props}/>
          ),
          code({node, inline, className, children, ...props}) {
            const match = /language-(\w+)/.exec(className || '')
            return !inline && match ? (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                className="rounded-md"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className="bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5" {...props}>
                {children}
              </code>
            )
          },
          table: ({node, ...props}) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700" {...props}/>
            </div>
          ),
          th: ({node, ...props}) => (
            <th className="px-3 py-2 text-left font-semibold bg-gray-100 dark:bg-gray-800" {...props}/>
          ),
          td: ({node, ...props}) => (
            <td className="px-3 py-2 border-t border-gray-200 dark:border-gray-700" {...props}/>
          ),
        }}
      >
        {content}
      </Markdown>
    </div>
  )
} 