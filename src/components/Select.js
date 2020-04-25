import ReactSelect from "react-select";

import countries from "../utils/countries.json";

function Select({ selected, label, error, onChange }) {
  return (
    <div className="flex flex-col">
      <label>{label}</label>
      <ReactSelect value={selected} onChange={onChange} options={countries} />
      {error !== "" && <span className="text-sm text-red-700">{error}</span>}
    </div>
  );
}

export default Select;
