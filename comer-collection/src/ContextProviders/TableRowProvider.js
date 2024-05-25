import React, { createContext, useContext, useMemo } from "react";
import PropTypes from "prop-types";
import { entityPropTypeShape, tableFieldPropTypeShape } from "../Classes/Entity.js";

const TableRowContext = createContext();

/**
 * @typedef {Object<string, () => void>} callbacksObject
 * @typedef {import("./ManagementPageProvider.js").Item} Item
 * @typedef {import("../Components/DataTable/TableRowContainer.js").ItemDictionaryEntry} ItemDictionaryEntry
 *
 * @typedef {{
 *  item: Item,
 *  itemDictionaryEntry: ItemDictionaryEntry
 *  setSelectionStatus: (newStatus: bool) => void
 *  managementCallbacks: callbacksObject,
 *  rowSelectionEnabled: boolean,
 *  smallCheckboxes: boolean,
 *  tableFields: {columnDescription: string}[]
 * }} TableRowContextValues
 *
 * @param {TableRowContextValues} props
 */
export const TableRowProvider = ({ itemDictionaryEntry, setSelectionStatus, managementCallbacks, rowSelectionEnabled, smallCheckboxes, tableFields, children }) => {
    const contextValue = useMemo(() => ({
        itemDictionaryEntry,
        setSelectionStatus,
        managementCallbacks,
        rowSelectionEnabled,
        smallCheckboxes,
        tableFields
    }), [itemDictionaryEntry, managementCallbacks, rowSelectionEnabled, setSelectionStatus, smallCheckboxes, tableFields]);
    return (
        <TableRowContext.Provider value={contextValue}>
            {children}
        </TableRowContext.Provider>
    );
};

TableRowProvider.propTypes = {
    children: PropTypes.node.isRequired,
    itemDictionaryEntry: PropTypes.shape({
        item: entityPropTypeShape,
        itemString: PropTypes.string
    }),
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
 * @returns The item represented in the Table Row
 */
export const useTableRowItemOld = () => {
    /**
     * @type {TableRowContextValues}
     */
    const contextValue = useContext(TableRowContext);
    const { itemDictionaryEntry: { item } } = contextValue;
    return item;
};

/**
 * Access the item and itemString within the TableRowContext
 * @returns The item dictionary entry containing the item and itemString
 */
export const useTableRowItem = () => {
    /**
     * @type {TableRowContextValues}
     */
    const contextValue = useContext(TableRowContext);
    return contextValue.itemDictionaryEntry;
};

/**
 * @returns {callbacksObject}
 */
export const useTableRowManagementCallbacks = () => {
    return useContext(TableRowContext).managementCallbacks;
};

/**
 * @returns {{columnDescription: string}[]}
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
