function Button({ type, onClick, variant = "primary", disabled, ...props }) {
  let buttonClass = "";
  switch (variant) {
    case "primary":
      buttonClass =
        "w-full text-white bg-purple-700 sm:w-1/2 md:w-1/4 hover:bg-purple-600";
      break;
    case "text":
      buttonClass = "hover:bg-gray-200";
  }

  if (disabled) buttonClass += " opacity-50 cursor-not-allowed";

  return (
    <button
      type={type}
      className={`p-2 rounded-md ${buttonClass}`}
      onClick={onClick}
      disabled={disabled}
    >
      {props.children}
    </button>
  );
}

export default Button;
