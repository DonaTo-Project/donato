function Button({ type, onClick, variant = "primary", ...props }) {
  let buttonClass = "";
  switch (variant) {
    case "primary":
      buttonClass =
        "w-full text-white bg-purple-700 sm:w-1/2 md:w-1/4 hover:bg-purple-600";
      break;
    case "text":
      buttonClass = "hover:bg-gray-200";
  }

  return (
    <button
      type={type}
      className={`p-2 rounded-md ${buttonClass}`}
      onClick={onClick}
    >
      {props.children}
    </button>
  );
}

export default Button;
