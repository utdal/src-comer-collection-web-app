import React, { useMemo } from "react";
import { DataTableCell } from "./DataTableCell.js";
import { TableCellProvider } from "../../ContextProviders/TableCellProvider.js";
import { useTableFields } from "../../ContextProviders/TableRowProvider.js";

export const DataTableFieldCells = ({ item, managementCallbacks }) => {
    const tableFields = useTableFields();
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
