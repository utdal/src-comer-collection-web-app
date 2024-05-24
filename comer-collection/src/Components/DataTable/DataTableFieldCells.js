import React, { useMemo } from "react";
import { DataTableCell } from "./DataTableCell.js";
import { TableCellProvider } from "../../ContextProviders/TableCellProvider.js";

export const DataTableFieldCells = ({ tableFields, item, managementCallbacks }) => {
    return useMemo(() => {
        return tableFields.map((tf) => {
            return (
                <TableCellProvider
                    item={item}
                    key={tf.columnDescription}
                    managementCallbacks={managementCallbacks}
                >
                    <DataTableCell
                        tf={tf}
                    />

                </TableCellProvider>
            );
        }
        );
    }, [tableFields, item, managementCallbacks]);
};
