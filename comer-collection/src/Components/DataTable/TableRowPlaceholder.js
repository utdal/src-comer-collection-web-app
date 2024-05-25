import React, { memo } from "react";
import { TableCell, Skeleton } from "@mui/material";
import { useTableCheckboxSettings, useTableFields } from "../../ContextProviders/TableRowProvider.js";

export const TableRowPlaceholder = memo(function TableContainer () {
    const tableFields = useTableFields();
    const { rowSelectionEnabled } = useTableCheckboxSettings();
    return (
        <TableCell
            colSpan={tableFields.length + (1 * rowSelectionEnabled)}
            size="medium"
        >
            <Skeleton
                height="20px"
                variant="text"
                width="100%"
            />
        </TableCell>
    );
});
