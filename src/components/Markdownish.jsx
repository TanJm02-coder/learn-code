// A tiny, safe inline formatter. Supports:
//   `code`           -> <code>
//   ```lang\n...```  -> <pre><code> fenced block (handled by caller via blocks)
// It intentionally avoids raw HTML, so user/content text can't inject markup.

function renderInline(text, keyBase) {
  // Split on backtick-delimited code spans.
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`') && part.length > 1) {
      return (
        <code key={`${keyBase}-${i}`} className="inline-code">
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={`${keyBase}-${i}`}>{part}</span>;
  });
}

// Renders a block of text that may contain a fenced ```code``` block.
export function Markdownish({ text }) {
  const fence = /```(\w+)?\n([\s\S]*?)```/;
  const match = text.match(fence);
  if (!match) {
    return (
      <>
        {text.split('\n').map((line, i) => (
          <p key={i} className="prose-line">
            {renderInline(line, `l${i}`)}
          </p>
        ))}
      </>
    );
  }
  const before = text.slice(0, match.index);
  const code = match[2].replace(/\n$/, '');
  const after = text.slice(match.index + match[0].length);
  return (
    <>
      {before.trim() && <Markdownish text={before} />}
      <pre className="code-block">
        <code>{code}</code>
      </pre>
      {after.trim() && <Markdownish text={after} />}
    </>
  );
}
