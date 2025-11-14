import React from "react";
import { IoIosSearch } from "react-icons/io";

const SearchBar = ({ onSearch }) => {
  return (
    <div className="navbar-actions ms-lg-4">
      <div className="search-wrapper d-flex align-items-center">
        <input
          className="form-control search-input"
          type="search"
          placeholder="Search products"
          aria-label="Search"
        />
        <button className="search-btn btn  ms-2" type="button" onClick={onSearch}>
          <IoIosSearch size={25}/>
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
