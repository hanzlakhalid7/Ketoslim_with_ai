interface NumberFieldProps {
  label: string;
  min?: number;
  step?: number;
  value: number | string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
}

export default function NumberField({ label, min, step = 1, value, onChange, error, placeholder }: NumberFieldProps) {
  return (
    <div className="mb-4">
      <div className="mb-1">
        <label className="text-sm font-medium">{label}</label>
        <span className="ml-1 text-red-600">*</span>
      </div>
      <input
        type="number"
        min={min}
        step={step}
        className="w-full px-3 py-2 inputBorder"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <div className="text-red-600 text-xs mt-1">{error}</div>}
    </div>
  );
}
