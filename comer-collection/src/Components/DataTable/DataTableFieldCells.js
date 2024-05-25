import React, { memo, useMemo } from "react";
import PropTypes from "prop-types";
import { DataTableCell } from "./DataTableCell.js";
import { TableCellProvider } from "../../ContextProviders/TableCellProvider.js";
import { entityPropTypeShape, tableFieldPropTypeShape } from "../../Classes/Entity.js";

/**
 * @typedef {import("../../ContextProviders/ManagementPageProvider.js").ItemDictionaryEntry} ItemDictionaryEntry
 * @param {{
 *      itemDictionaryEntry: ItemDictionaryEntry
 * }} props
 * @returns {React.JSX.Element}
 */
export const DataTableFieldCells = memo(function DataTableFieldCells ({ tableFields, itemDictionaryEntry, managementCallbacks }) {
    return useMemo(() => (
        <TableCellProvider
            itemDictionaryEntry={itemDictionaryEntry}
            managementCallbacks={managementCallbacks}
        >
            {tableFields.map((tf) => (
                <DataTableCell
                    key={tf.columnDescription}
                    tf={tf}
                />
            ))}
        </TableCellProvider>
    ), [tableFields, itemDictionaryEntry, managementCallbacks]);
});

DataTableFieldCells.propTypes = {
    itemDictionaryEntry: PropTypes.shape({
        item: entityPropTypeShape,
        itemString: PropTypes.string
    }),
    managementCallbacks: PropTypes.objectOf(PropTypes.func),
    tableFields: PropTypes.arrayOf(tableFieldPropTypeShape)
};
