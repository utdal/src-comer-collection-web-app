import React, { useMemo } from "react";
import { DataTableCell } from "./DataTableCell.js";

export const DataTableFieldCells = ({ tableFields, item: itemAsString }) => {
    return useMemo(() => {
        return tableFields.map((tf) => {
            return (
                <DataTableCell
                    itemAsString={itemAsString}
                    key={tf.columnDescription}
                    tf={tf}
                />
            );
        }
        );
    }, [tableFields, itemAsString]);
};
