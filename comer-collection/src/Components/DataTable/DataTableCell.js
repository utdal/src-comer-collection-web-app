import React, { useMemo } from "react";
import { TableCell } from "@mui/material";
import PropTypes from "prop-types";

export const DataTableCell = ({ tf }) => {
    return useMemo(() => {
        return (
            <TableCell sx={{ maxWidth: tf.maxWidth ?? "unset", wordWrap: tf.maxWidth ? "break-word" : "unset" }}>
                <tf.TableCellComponent />
            </TableCell>
        );
    }, [tf]);
};
DataTableCell.propTypes = {
    tf: PropTypes.shape({
        columnDescription: PropTypes.string
    })
};
