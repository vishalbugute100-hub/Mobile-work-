// Minimal text format for editable content: blank line = paragraph, "## " = heading, "- " = bullet list.
export function RichText({ text, className = "" }: { text: string; className?: string }) {
  const blocks = text.replace(/\r/g, "").split(/\n{2,}/);
  return (
    <div className={`space-y-4 ${className}`}>
      {blocks.map((b, i) => {
        const lines = b.split("\n");
        const out: React.ReactNode[] = [];
        let list: string[] = [];
        const flush = () => { if (list.length) { out.push(<ul key={out.length} className="list-disc space-y-1 pl-6">{list.map((l, k) => <li key={k}>{l}</li>)}</ul>); list = []; } };
        for (const l of lines) {
          if (l.startsWith("## ")) { flush(); out.push(<h2 key={out.length} className="font-display pt-2 text-2xl font-semibold text-forest">{l.slice(3)}</h2>); }
          else if (l.startsWith("- ")) list.push(l.slice(2));
          else if (l.trim()) { flush(); out.push(<p key={out.length}>{l}</p>); }
        }
        flush();
        return <div key={i} className="space-y-3">{out}</div>;
      })}
    </div>
  );
}
