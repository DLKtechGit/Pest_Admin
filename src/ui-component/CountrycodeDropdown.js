import React, { useEffect, useState } from "react";
import Select from "react-select";
import { CountryCodes } from "./country";

export default function DropdownSearchForCountryCode(props) {
  const [selectedOptions, setSelectedOptions] = useState();
  const [optionList, setoptionList] = useState([]);

  const MapCountrylist = () => {
    CountryCodes.map((val) => {
      let obj = {
        value: val.dial_code,
        label: val.dial_code + "\xa0" + val.name,
      };
      optionList.push(obj);
      setoptionList(optionList);
    });
  };

  useEffect(() => {
    MapCountrylist();
  }, []);

  function handleSelect(data) {
    const temp = data.label.replace(/\d+/g, "");
    const Country_Name = temp.replace("+", "");
    let obj = { value: data.value, label: data.value };
    setSelectedOptions(obj);
    props.setCountry(data.value);
    props.setcountryName(Country_Name);
  }
  const def = {
    "value": "+966",
    "label": "+966"
  }

  return (
    <div className="app">
      <div className="dropdown-container">
        <Select
          options={optionList}
          defaultValue={def}
          value={selectedOptions}
          onChange={handleSelect}
          isSearchable={true}
        />
      </div>
    </div>
  );
}
