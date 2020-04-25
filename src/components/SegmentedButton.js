function SegmentedButton({ label, selected, options, onChange }) {
  return (
    <div className="flex flex-col">
      {label && <label>{label}</label>}
      <div className="flex flex-row">
        {options.map((option, i) => {
          let roundness = "";
          if (i === 0) roundness = "rounded-l-md";
          else if (i === options.length - 1) roundness = "rounded-r-md";

          return (
            <button
              type="button"
              className={`p-2 text-purple-900 ${
                option === selected ? "bg-purple-300" : "bg-purple-200"
              } ${roundness}`}
              key={i}
              onClick={() => onChange(option)}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default SegmentedButton;
