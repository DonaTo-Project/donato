function TextArea({ label, value, onChange }) {
  return (
    <div className="flex flex-col">
      <label>{label}</label>
      <textarea
        onChange={onChange}
        className="p-2 bg-gray-200 rounded-md"
        value={value}
      />
    </div>
  );
}

export default TextArea;
