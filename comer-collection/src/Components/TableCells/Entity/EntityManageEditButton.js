import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { EditButton } from "./EditButton.js";
import { useManagementCallbacks } from "../../../ContextProviders/ManagementPageProvider.js";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider.js";

export const EntityManageEditButton = ({ disabled = false }) => {
    const item = useTableCellItem();
    const { handleOpenEntityEditDialog } = useManagementCallbacks();
    const handleOpenEditDialog = useCallback(() => {
        handleOpenEntityEditDialog(item);
    }, [handleOpenEntityEditDialog, item]);
    return (
        <EditButton
            disabled={disabled}
            onClick={handleOpenEditDialog}
        />
    );
};

EntityManageEditButton.propTypes = {
    disabled: PropTypes.bool.isRequired
};
