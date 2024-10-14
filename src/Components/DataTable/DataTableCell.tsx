import React, { useMemo } from "react";
import { TableCell } from "@mui/material";
import type { TableFieldDefinition } from "../..";

const DataTableCell = ({ tf }: {
    readonly tf: TableFieldDefinition;
}): React.JSX.Element => useMemo(() => (
    <TableCell sx={{ maxWidth: tf.maxWidth ?? "unset", wordWrap: typeof(tf.maxWidth) === "string" ? "unset" : "break-word" }}>
        <tf.TableCellComponent />
    </TableCell>
), [tf]);

export default DataTableCell;
