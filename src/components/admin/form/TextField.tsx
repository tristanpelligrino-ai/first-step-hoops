export function TextField({
  name,
  label,
  type = "text",
  required,
  defaultValue,
  placeholder,
  hint,
  step,
  min,
  max,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  defaultValue?: string | number;
  placeholder?: string;
  hint?: string;
  step?: number | string;
  min?: number | string;
  max?: number | string;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="mono-eyebrow text-white/60">
        {label}
        {required ? <span className="text-orange"> *</span> : null}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        step={step}
        min={min}
        max={max}
        className="h-11 px-3 bg-navy-2 border border-white/15 rounded-btn text-white text-[15px] focus:border-blue focus:outline-none [color-scheme:dark]"
      />
      {hint ? <span className="text-[12px] text-white/50">{hint}</span> : null}
    </label>
  );
}
