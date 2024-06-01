import React, { memo, useMemo } from "react";
import DataTableCell from "./DataTableCell";
import { TableCellProvider } from "../../ContextProviders/TableCellProvider";
import type { Item, ManagementCallbacks, TableFieldDefinition } from "../../index";

const DataTableFieldCells = ({ tableFields, item, managementCallbacks }: {
    readonly tableFields: TableFieldDefinition[];
    readonly item: Item;
    readonly managementCallbacks: ManagementCallbacks;
}): React.JSX.Element => {
    return useMemo(() => (
        <TableCellProvider
            item={item}
            managementCallbacks={managementCallbacks}
        >
            {tableFields.map((tf) => (
                <DataTableCell
                    key={tf.columnDescription}
                    tf={tf}
                />
            ))}
        </TableCellProvider>
    ), [tableFields, item, managementCallbacks]);
};

export default memo(DataTableFieldCells);
