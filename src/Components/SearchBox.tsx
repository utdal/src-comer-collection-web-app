/* eslint-disable react/no-multi-comp */
import React, { useCallback, useMemo } from "react";
import type { IconButtonOwnProps, OutlinedTextFieldProps } from "@mui/material";
import { TextField, InputAdornment, IconButton, styled } from "@mui/material";
import { SearchIcon, ClearIcon } from "../Imports/Icons.js";
import { useEntity, useItemCounts } from "../ContextProviders/ManagementPageProvider";

interface DisappearingIconButtonProps extends IconButtonOwnProps {
    isVisible: boolean;
}

interface FixedWidthTextFieldProps extends OutlinedTextFieldProps {
    width: string;
}

/**
 * Use as regular IconButton and add isVisible Boolean property
 */
const DisappearingIconButton = styled(IconButton, {
    shouldForwardProp: (prop) => prop !== "isVisible"
})(({ isVisible }: DisappearingIconButtonProps) => ({
    display: isVisible ? "" : "none"
}));

const FixedWidthTextField = styled(TextField)(({ width }: FixedWidthTextFieldProps) => ({
    width
}));

const SearchBox = ({ searchQuery, setSearchQuery, width }: {
    readonly searchQuery: string;
    readonly setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    readonly width?: string;
}): React.JSX.Element => {
    const { searchBoxPlaceholder } = useEntity();
    const itemCounts = useItemCounts();

    const handleEditSearchQuery = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
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
            disabled={itemCounts.all === 0}
            onChange={handleEditSearchQuery}
            placeholder={searchBoxPlaceholder}
            value={searchQuery}
            variant="outlined"
            width={width ?? "200px"}
        />
    );
};

export default SearchBox;
