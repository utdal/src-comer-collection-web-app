/* eslint-disable react/no-multi-comp */
import React, { useCallback, useMemo } from "react";
import { TextField, InputAdornment, IconButton, styled } from "@mui/material";
import { SearchIcon, ClearIcon } from "../Imports/Icons.js";
import PropTypes from "prop-types";

/**
 * Use as regular IconButton and add isVisible Boolean property
 */
const DisappearingIconButton = styled(IconButton)(({ isVisible }) => ({
    display: isVisible ? "" : "none"
}));

const FixedWidthTextField = styled(TextField)(({ width }) => ({
    width
}));

const SearchBox = ({ searchQuery, setSearchQuery, width, placeholder }) => {
    const handleEditSearchQuery = useCallback((e) => {
        setSearchQuery(e.target.value);
    }, [setSearchQuery]);

    const handleClearSearchQuery = useCallback(() => {
        setSearchQuery("");
    }, [setSearchQuery]);

    const textfieldInputProps = useMemo(() => ({
        height: "100%",
        startAdornment: (
            <InputAdornment position="start">
                <SearchIcon />
            </InputAdornment>
        ),
        endAdornment: (
            <InputAdornment position="end">
                <DisappearingIconButton
                    isVisible={Boolean(searchQuery)}
                    onClick={handleClearSearchQuery}
                >
                    <ClearIcon />
                </DisappearingIconButton>
            </InputAdornment>
        )

    }), [handleClearSearchQuery, searchQuery]);

    return (
        <FixedWidthTextField
            InputProps={textfieldInputProps}
            onChange={handleEditSearchQuery}
            placeholder={placeholder ?? "Search"}
            value={searchQuery}
            variant="outlined"
            width={width}
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
