import React, { useMemo } from "react";
import { TableCell } from "@mui/material";
import type { TableFieldDefinition } from "../..";

const DataTableCell = ({ tf }: {
    readonly tf: TableFieldDefinition;
}): React.JSX.Element => {
    return useMemo(() => {
        return (
            <TableCell sx={{ maxWidth: tf.maxWidth ?? "unset", wordWrap: tf.maxWidth != null ? "break-word" : "unset" }}>
                <tf.TableCellComponent />
            </TableCell>
        );
    }, [tf]);
};

export default DataTableCell;
