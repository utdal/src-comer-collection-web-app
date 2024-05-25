import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { useManagementCallbacks } from "../../../ContextProviders/ManagementPageProvider.js";
import { DeleteButton } from "./DeleteButton.js";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider.js";

export const EntityManageDeleteButton = ({ disabled = false }) => {
    const item = useTableCellItem();
    const { handleOpenEntityDeleteDialog } = useManagementCallbacks();
    const handleOpenDeleteDialog = useCallback(() => {
        handleOpenEntityDeleteDialog(item);
    }, [handleOpenEntityDeleteDialog, item]);
    return (
        <DeleteButton
            disabled={disabled}
            onClick={handleOpenDeleteDialog}
        />
    );
};

EntityManageDeleteButton.propTypes = {
    disabled: PropTypes.bool.isRequired
};
