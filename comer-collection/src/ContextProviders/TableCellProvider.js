import React, { createContext, useContext, useMemo } from "react";
import PropTypes from "prop-types";
import { entityPropTypeShape } from "../Classes/Entity.js";

const TableCellContext = createContext();

/**
 * @typedef {Object<string, () => void>} callbacksObject
 * @param {{
*  item: object,
*  managementCallbacks: callbacksObject
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
    item: entityPropTypeShape.isRequired,
    managementCallbacks: PropTypes.objectOf(PropTypes.func)
};

/**
 * Access the item within the TableRowContext
 * @returns {Object} The item represented in the Table Row
 */
export const useTableCellItem = () => {
    return useContext(TableCellContext).item;
};

/**
 * @returns {callbacksObject}
 */
export const useTableCellManagementCallbacks = () => {
    return useContext(TableCellContext).managementCallbacks;
};
