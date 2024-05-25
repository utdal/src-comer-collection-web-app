import React, { createContext, useContext, useMemo } from "react";
import PropTypes from "prop-types";
import { entityPropTypeShape } from "../Classes/Entity.js";

const TableCellContext = createContext();

/**
 * @typedef {Object<string, () => void>} callbacksObject
 * @typedef {import("../Components/DataTable/DataTableFieldCells.js").ItemDictionaryEntry} ItemDictionaryEntry
 *
 * @param {{
 *      itemDictionaryEntry: ItemDictionaryEntry,
 *      managementCallbacks: callbacksObject
 * }} props
*/
export const TableCellProvider = ({ itemDictionaryEntry, managementCallbacks, children }) => {
    const contextValue = useMemo(() => ({
        itemDictionaryEntry,
        managementCallbacks
    }), [itemDictionaryEntry, managementCallbacks]);
    return (
        <TableCellContext.Provider value={contextValue}>
            {children}
        </TableCellContext.Provider>
    );
};

TableCellProvider.propTypes = {
    children: PropTypes.node.isRequired,
    itemDictionaryEntry: PropTypes.shape({
        item: entityPropTypeShape,
        itemString: PropTypes.string
    }),
    managementCallbacks: PropTypes.objectOf(PropTypes.func)
};

/**
 * Access the item within the TableRowContext
 * @returns The item represented in the Table Row
 */
export const useTableCellItem = () => {
    /**
     * @type {{itemDictionaryEntry: ItemDictionaryEntry}}
     */
    const { itemDictionaryEntry } = useContext(TableCellContext);
    return itemDictionaryEntry.item;
};

/**
 * @returns {callbacksObject}
 */
export const useTableCellManagementCallbacks = () => {
    return useContext(TableCellContext).managementCallbacks;
};
