function TextBox({ label, value, onChange, ...props }) {
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
    </div>
  );
}

export default TextBox;
