import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { TableRowProvider } from "../../ContextProviders/TableRowProvider.js";
import { useManagementCallbacks, useSelectionStatuses } from "../../ContextProviders/ManagementPageProvider.js";
import DataTableRow from "./DataTableRow.js";
import { entityPropTypeShape, tableFieldPropTypeShape } from "../../Classes/Entity.js";

export const TableRowContainer = ({ item, tableFields, rowSelectionEnabled, smallCheckboxes }) => {
    const [selectionStatuses, setItemSelectionStatus] = useSelectionStatuses();
    const themeColor = item.is_admin_or_collection_manager ? "secondary" : "primary";

    /**
     * @type {(newStatus: boolean) => void}
     */
    const setSelectionStatus = useCallback((newStatus) => {
        setItemSelectionStatus(item.id, newStatus);
    }, [item, setItemSelectionStatus]);

    const managementCallbacks = useManagementCallbacks();
    return (
        <TableRowProvider
            item={item}
            managementCallbacks={managementCallbacks}
            rowSelectionEnabled={rowSelectionEnabled}
            setSelectionStatus={setSelectionStatus}
            smallCheckboxes={smallCheckboxes}
            tableFields={tableFields}
        >
            <DataTableRow
                isSelected={selectionStatuses[item.id]}
                themeColor={themeColor}
            />
        </TableRowProvider>
    );
};

TableRowContainer.propTypes = {
    item: entityPropTypeShape,
    rowSelectionEnabled: PropTypes.bool,
    smallCheckboxes: PropTypes.bool,
    tableFields: PropTypes.arrayOf(PropTypes.shape(tableFieldPropTypeShape)).isRequired
};
