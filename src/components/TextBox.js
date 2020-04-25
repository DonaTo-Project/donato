function TextBox({ label, value, onChange, error, ...props }) {
  return (
    <div className="flex flex-col">
      <label>{label}</label>
      <input
        type="text"
        onChange={onChange}
        className="p-2 bg-gray-200 rounded-md"
        value={value}
        {...props}
      />
      {error !== "" && <span className="text-sm text-red-700">{error}</span>}
    </div>
  );
}

export default TextBox;
