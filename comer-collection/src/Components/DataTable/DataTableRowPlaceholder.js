import React, { memo } from "react";
import PropTypes from "prop-types";
import { TableCell, Skeleton } from "@mui/material";

/**
 * @type {(props: {
 *      colSpan: number
 * })}
 */
export const DataTableRowPlaceholder = memo(function TableRowPlaceholder ({ colSpan }) {
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

DataTableRowPlaceholder.propTypes = {
    colSpan: PropTypes.number
};
