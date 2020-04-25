function TextArea({ label, value, onChange, error }) {
  return (
    <div className="flex flex-col">
      <label>{label}</label>
      <textarea
        onChange={onChange}
        className="p-2 bg-gray-200 rounded-md"
        value={value}
      />
      {error !== "" && <span className="text-sm text-red-700">{error}</span>}
    </div>
  );
}

export default TextArea;
