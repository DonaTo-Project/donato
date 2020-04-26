function TextBox({ label, value, onChange, error, type = "text", ...props }) {
  return (
    <div className="flex flex-col">
      <label>{label}</label>
      <input
        type={type}
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
