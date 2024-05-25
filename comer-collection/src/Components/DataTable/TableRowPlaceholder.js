import React, { memo } from "react";
import { TableCell, Skeleton } from "@mui/material";
import { useTableCheckboxSettings, useTableFields } from "../../ContextProviders/TableRowProvider.js";

export const TableRowPlaceholder = memo(function TableContainer () {
    const tableFields = useTableFields();
    const { rowSelectionEnabled } = useTableCheckboxSettings();
    const colSpan = tableFields.length + (1 * rowSelectionEnabled);
    return (
        <TableCell
            colSpan={colSpan}
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
