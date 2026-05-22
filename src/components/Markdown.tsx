import ReactMarkdown from "react-markdown";

/**
 * Renders markdown (used for the liability waiver) styled for the dark theme.
 * Only the elements a waiver document needs are mapped.
 */
export function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      components={{
        h1: ({ children }) => (
          <h2 className="text-[17px] font-semibold text-white mt-5 mb-2 first:mt-0">
            {children}
          </h2>
        ),
        h2: ({ children }) => (
          <h3 className="text-[15px] font-semibold text-white mt-4 mb-2">
            {children}
          </h3>
        ),
        h3: ({ children }) => (
          <h4 className="text-[14px] font-semibold text-white mt-3 mb-1">
            {children}
          </h4>
        ),
        p: ({ children }) => (
          <p className="text-[13px] leading-relaxed text-white/75 mb-3">
            {children}
          </p>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold text-white">{children}</strong>
        ),
        em: ({ children }) => <em className="italic">{children}</em>,
        ul: ({ children }) => (
          <ul className="list-disc pl-5 mb-3 flex flex-col gap-1">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal pl-5 mb-3 flex flex-col gap-1">
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li className="text-[13px] leading-relaxed text-white/75">
            {children}
          </li>
        ),
        hr: () => <hr className="border-0 border-t border-white/15 my-4" />,
        a: ({ children, href }) => (
          <a href={href} className="text-blue-soft underline">
            {children}
          </a>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-2 border-white/20 pl-3 text-white/60 mb-3">
            {children}
          </blockquote>
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
