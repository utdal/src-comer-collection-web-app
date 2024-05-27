import React, { useCallback } from "react";
import { IconButton } from "@mui/material";
import { SwapVertIcon, ArrowUpwardIcon, ArrowDownwardIcon } from "../../Imports/Icons.js";
import PropTypes from "prop-types";

export const ColumnSortButton = ({ columnName, sortColumn, setSortColumn, sortAscending, setSortAscending }) => {
    const handleClick = useCallback(() => {
        if (sortColumn === columnName) { setSortAscending((current) => !current); } else {
            setSortColumn(columnName);
            setSortAscending(true);
        }
    }, [columnName, setSortAscending, setSortColumn, sortColumn]);

    return (
        <IconButton
            color={sortColumn === columnName ? "primary" : "grey"}
            onClick={handleClick}
            size="medium"
        >
            {sortColumn === columnName
                ? (
                    sortAscending
                        ? <ArrowUpwardIcon fontSize="medium" />
                        : <ArrowDownwardIcon fontSize="medium" />
                )
                : <SwapVertIcon fontSize="medium" />}
        </IconButton>
    );
};

ColumnSortButton.propTypes = {
    columnName: PropTypes.string.isRequired,
    setSortAscending: PropTypes.func.isRequired,
    setSortColumn: PropTypes.func.isRequired,
    sortAscending: PropTypes.bool.isRequired,
    sortColumn: PropTypes.string.isRequired
};
