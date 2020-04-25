import ReactSelect from "react-select";

import countries from "../utils/countries.json";

function Select({ selected, onChange }) {
  return (
    <ReactSelect value={selected} onChange={onChange} options={countries} />
  );
}

export default Select;
