import React, { memo, useMemo } from "react";
import PropTypes from "prop-types";
import { DataTableCell } from "./DataTableCell.js";
import { TableCellProvider } from "../../ContextProviders/TableCellProvider.js";
import { entityPropTypeShape, tableFieldPropTypeShape } from "../../Classes/Entity.js";

/**
 * @returns {React.JSX.Element}
 */
export const DataTableFieldCells = memo(function DataTableFieldCells ({ tableFields, item, managementCallbacks }) {
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
});

DataTableFieldCells.propTypes = {
    item: entityPropTypeShape,
    managementCallbacks: PropTypes.objectOf(PropTypes.func),
    tableFields: PropTypes.arrayOf(tableFieldPropTypeShape)
};
