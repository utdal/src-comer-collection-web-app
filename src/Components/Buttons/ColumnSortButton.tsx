import React, { useCallback } from "react";
import { IconButton } from "@mui/material";
import { SwapVertIcon, ArrowUpwardIcon, ArrowDownwardIcon } from "../../Imports/Icons.js";

const ColumnSortButton = ({ columnName, sortColumn, setSortColumn, sortAscending, setSortAscending }: {
    readonly columnName: string;
    readonly sortColumn: string;
    readonly setSortColumn: React.Dispatch<React.SetStateAction<string>>;
    readonly sortAscending: boolean;
    readonly setSortAscending: React.Dispatch<React.SetStateAction<boolean>>;
}): React.JSX.Element => {
    const handleClick = useCallback(() => {
        if (sortColumn === columnName) {
            setSortAscending((current) => !current);
        } else {
            setSortColumn(columnName);
            setSortAscending(true);
        }
    }, [columnName, setSortAscending, setSortColumn, sortColumn]);

    return (
        <IconButton
            color={sortColumn === columnName ? "primary" : "inherit"}
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

export default ColumnSortButton;
