import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { TableRowProvider } from "../../ContextProviders/TableRowProvider.js";
import { useManagementCallbacks, useSelectionStatuses } from "../../ContextProviders/ManagementPageProvider.js";
import DataTableRow from "./DataTableRow.js";
import { entityPropTypeShape, tableFieldPropTypeShape } from "../../Classes/Entity.js";

/**
 * @typedef {import("../../ContextProviders/ManagementPageProvider.js").ItemDictionaryEntry} ItemDictionaryEntry
 * @param {{
 *      itemDictionaryEntry: ItemDictionaryEntry
 * }} props
 */
export const TableRowContainer = ({ itemDictionaryEntry, tableFields, rowSelectionEnabled, smallCheckboxes }) => {
    const [selectionStatuses, setItemSelectionStatus] = useSelectionStatuses();

    const { item } = itemDictionaryEntry;

    const themeColor = item.is_admin_or_collection_manager ? "secondary" : "primary";

    /**
     * @type {(newStatus: boolean) => void}
     */
    const setSelectionStatus = useCallback((newStatus) => {
        setItemSelectionStatus(itemDictionaryEntry.item.id, newStatus);
    }, [itemDictionaryEntry, setItemSelectionStatus]);

    const managementCallbacks = useManagementCallbacks();
    return (
        <TableRowProvider
            itemDictionaryEntry={itemDictionaryEntry}
            managementCallbacks={managementCallbacks}
            rowSelectionEnabled={Boolean(rowSelectionEnabled)}
            setSelectionStatus={setSelectionStatus}
            smallCheckboxes={Boolean(smallCheckboxes)}
            tableFields={tableFields}
        >
            <DataTableRow
                isSelected={Boolean(selectionStatuses[item.id])}
                themeColor={themeColor}
            />
        </TableRowProvider>
    );
};

TableRowContainer.propTypes = {
    itemDictionaryEntry: PropTypes.shape({
        item: entityPropTypeShape,
        itemString: PropTypes.string
    }),
    rowSelectionEnabled: PropTypes.bool,
    smallCheckboxes: PropTypes.bool,
    tableFields: PropTypes.arrayOf(tableFieldPropTypeShape).isRequired
};
