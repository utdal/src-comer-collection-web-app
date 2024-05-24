import React, { createContext, useContext, useMemo } from "react";
import PropTypes from "prop-types";
import { entityPropTypeShape } from "../Classes/Entity.js";

const TableRowContext = createContext();

/**
 * @typedef {Object<string, () => void>} callbacksObject
 * @param {{
 *  item: object,
 *  selectedItems: object[],
 *  setSelectedItems: (items: object[]) => void
 *  managementCallbacks: callbacksObject
 * }} props
 */
export const TableRowProvider = ({ item, selectedItems, setSelectedItems, managementCallbacks, children }) => {
    const contextValue = useMemo(() => ({
        item,
        selectedItems,
        setSelectedItems,
        managementCallbacks
    }), [item, managementCallbacks, selectedItems, setSelectedItems]);
    return (
        <TableRowContext.Provider value={contextValue}>
            {children}
        </TableRowContext.Provider>
    );
};

TableRowProvider.propTypes = {
    children: PropTypes.node.isRequired,
    item: entityPropTypeShape.isRequired,
    managementCallbacks: PropTypes.objectOf(PropTypes.func),
    selectedItems: PropTypes.arrayOf(entityPropTypeShape).isRequired,
    setSelectedItems: PropTypes.func.isRequired
};

/**
 * Intended to forward the ManagementPageProvider
 * selectedItems and setSelectedItems context values
 * to the TableRowProvider.
 */
export const useTableSelectedItems = () => {
    /**
     * @type {{
     *  selectedItems: object[],
     *  setSelectedItems: (items: object[]) => void
     * }}
     */
    const { selectedItems, setSelectedItems } = useContext(TableRowContext);
    return [selectedItems, setSelectedItems];
};

/**
 * Access the item within the TableRowContext
 * @returns {Object} The item represented in the Table Row
 */
export const useTableRowItem = () => {
    return useContext(TableRowContext).item;
};

/**
 * @returns {callbacksObject}
 */
export const useTableRowManagementCallbacks = () => {
    return useContext(TableRowContext).managementCallbacks;
};
