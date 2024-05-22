import React from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import { SearchIcon, ClearIcon } from "../Imports/Icons.js";
import PropTypes from "prop-types";

const SearchBox = ({ searchQuery, setSearchQuery, width, placeholder }) => {
    return (
        <TextField
            InputProps={{
                sx: {
                    height: "100%"
                },
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon />
                    </InputAdornment>
                ),
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton
                            onClick={() => {
                                setSearchQuery("");
                            }}
                            sx={{
                                display: searchQuery === "" ? "none" : ""
                            }}
                        >
                            <ClearIcon />
                        </IconButton>
                    </InputAdornment>
                )
            }}
            onChange={(e) => {
                setSearchQuery(e.target.value);
            }}
            placeholder={placeholder ?? "Search"}
            sx={{ width }}
            value={searchQuery}
            variant="outlined"
        />
    );
};

SearchBox.propTypes = {
    placeholder: PropTypes.string,
    searchQuery: PropTypes.string,
    setSearchQuery: PropTypes.func,
    width: PropTypes.string
};

export default SearchBox;
