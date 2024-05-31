import React, { createContext, useContext, useMemo } from "react";
import PropTypes from "prop-types";
import { entityPropTypeShape } from "../Classes/Entity.js";

const TableCellContext = createContext();

/**
 * @typedef {import("./ManagementPageProvider.js").ManagementCallbacks} ManagementCallbacks
 * @typedef {import("./ManagementPageProvider.js").Item} Item
 *
 * @param {{
 *      item: Item,
 *      managementCallbacks: callbacksObject
 * }} props
*/
export const TableCellProvider = ({ item, managementCallbacks, children }) => {
    const contextValue = useMemo(() => ({
        item,
        managementCallbacks
    }), [item, managementCallbacks]);
    return (
        <TableCellContext.Provider value={contextValue}>
            {children}
        </TableCellContext.Provider>
    );
};

TableCellProvider.propTypes = {
    children: PropTypes.node.isRequired,
    item: entityPropTypeShape,
    managementCallbacks: PropTypes.objectOf(PropTypes.func)
};

/**
 * Access the item within the TableRowContext
 * @returns The item represented in the Table Row
 */
export const useTableCellItem = () => {
    /**
     * @type {{item: Item}}
     */
    const { item } = useContext(TableCellContext);
    return item;
};

/**
 * @returns {ManagementCallbacks}
 */
export const useTableCellManagementCallbacks = () => {
    return useContext(TableCellContext).managementCallbacks;
};
