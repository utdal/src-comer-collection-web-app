import React, { memo } from "react";
import { TableCell, Skeleton } from "@mui/material";
import PropTypes from "prop-types";

export const TableRowPlaceholder = memo(function TableContainer ({ colSpan }) {
    return (
        <TableCell colSpan={colSpan}>
            <Skeleton
                height="20px"
                variant="text"
                width="100%"
            />
        </TableCell>
    );
});
TableRowPlaceholder.propTypes = {
    colSpan: PropTypes.number.isRequired
};
