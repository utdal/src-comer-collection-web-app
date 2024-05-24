import React, { createContext, useContext, useMemo } from "react";
import PropTypes from "prop-types";
import { entityPropTypeShape, tableFieldPropTypeShape } from "../Classes/Entity.js";

const TableRowContext = createContext();

/**
 * @typedef {Object<string, () => void>} callbacksObject
 * @param {{
 *  item: object,
 *  setSelectionStatus: (newStatus: bool) => void
 *  managementCallbacks: callbacksObject,
 *  rowSelectionEnabled: boolean,
 *  smallCheckboxes: boolean,
 *  tableFields: {columnDescription: string}[]
 * }} props
 */
export const TableRowProvider = ({ item, setSelectionStatus, managementCallbacks, rowSelectionEnabled, smallCheckboxes, tableFields, children }) => {
    const contextValue = useMemo(() => ({
        item,
        setSelectionStatus,
        managementCallbacks,
        rowSelectionEnabled,
        smallCheckboxes,
        tableFields
    }), [item, managementCallbacks, rowSelectionEnabled, setSelectionStatus, smallCheckboxes, tableFields]);
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
    rowSelectionEnabled: PropTypes.bool,
    setSelectionStatus: PropTypes.func.isRequired,
    smallCheckboxes: PropTypes.bool,
    tableFields: PropTypes.arrayOf(tableFieldPropTypeShape)
};

/**
 * Intended to forward the ManagementPageProvider
 * selectedItems and setSelectedItems context values
 * to the TableRowProvider.
 */
export const useSetSelectionStatus = () => {
    /**
     * @type {{
     *  selectedItems: object[],
     *  setSelectedItems: (items: object[]) => void
     * }}
     */
    const { setSelectionStatus } = useContext(TableRowContext);
    return setSelectionStatus;
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

/**
 * @returns {callbacksObject}
 */
export const useTableFields = () => {
    return useContext(TableRowContext).tableFields;
};

/**
 * @returns {{rowSelectionEnabled: boolean, smallCheckboxes: boolean}}
 */
export const useTableCheckboxSettings = () => {
    const { rowSelectionEnabled, smallCheckboxes } = useContext(TableRowContext);
    return { rowSelectionEnabled, smallCheckboxes };
};
