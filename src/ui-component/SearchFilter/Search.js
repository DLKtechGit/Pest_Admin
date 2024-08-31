
import React from 'react';
import { Input } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';


const Search = ({ onChange, value, style ,placeholder}) => {
  return (
    <div>
      <Input
        onChange={onChange}
        value={value}
       placeholder={placeholder}
        style={style}
        
        suffix={<FontAwesomeIcon icon={faSearch} />}
      />
    </div>
  );
};

export default Search;
