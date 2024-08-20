import React, { createContext, useContext, useMemo } from "react";
import type { Item, ManagementCallbacks } from "../index.js";

interface TableCellContextValue {
    item: Item;
    managementCallbacks: ManagementCallbacks;
}

const TableCellContext = createContext((null as unknown) as TableCellContextValue);

export const TableCellProvider = ({ item, managementCallbacks, children }: {
    readonly item: Item;
    readonly managementCallbacks: ManagementCallbacks;
    readonly children: React.ReactNode;
}): React.JSX.Element => {
    const contextValue: TableCellContextValue = useMemo(() => ({
        item,
        managementCallbacks
    }), [item, managementCallbacks]);
    return (
        <TableCellContext.Provider value={contextValue}>
            {children}
        </TableCellContext.Provider>
    );
};

/**
 * Access the item within the TableRowContext
 * @returns The item represented in the Table Row
 */
export const useTableCellItem = (): Item => {
    const { item } = useContext(TableCellContext);
    return item;
};

/**
 * @returns {ManagementCallbacks}
 */
export const useTableCellManagementCallbacks = (): ManagementCallbacks => {
    return useContext(TableCellContext).managementCallbacks;
};
