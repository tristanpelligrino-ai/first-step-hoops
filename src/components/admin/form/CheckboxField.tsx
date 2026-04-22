export function CheckboxField({
  name,
  label,
  hint,
  defaultChecked,
}: {
  name: string;
  label: string;
  hint?: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <input
        name={name}
        type="checkbox"
        defaultChecked={defaultChecked}
        className="mt-[2px] w-4 h-4 accent-blue"
      />
      <span className="flex flex-col gap-1">
        <span className="text-[14px] text-white">{label}</span>
        {hint ? <span className="text-[12px] text-white/50">{hint}</span> : null}
      </span>
    </label>
  );
}
