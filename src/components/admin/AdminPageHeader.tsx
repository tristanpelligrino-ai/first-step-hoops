export function AdminPageHeader({
  eyebrow,
  title,
  actions,
}: {
  eyebrow?: string;
  title: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="flex items-end justify-between gap-6 mb-10 flex-wrap">
      <div>
        {eyebrow ? (
          <div className="mono-eyebrow text-blue mb-3">
            <span className="inline-block w-6 h-px bg-blue mr-[10px] align-middle" />
            {eyebrow}
          </div>
        ) : null}
        <h1
          className="display m-0"
          style={{ fontSize: "clamp(36px, 5vw, 64px)" }}
        >
          {title}
        </h1>
      </div>
      {actions ? <div className="flex gap-3">{actions}</div> : null}
    </header>
  );
}
