import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { useManagementCallbacks } from "../../../ContextProviders/ManagementPageProvider.js";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider.js";
import { PermanentDeleteButton } from "./PermanentDeleteButton.js";

export const EntityManagePermanentDeleteButton = ({ disabled = false }) => {
    const item = useTableCellItem();
    const { handleOpenEntityDeleteDialog } = useManagementCallbacks();
    const handleOpenDeleteDialog = useCallback(() => {
        handleOpenEntityDeleteDialog(item);
    }, [handleOpenEntityDeleteDialog, item]);
    return (
        <PermanentDeleteButton
            disabled={disabled}
            onClick={handleOpenDeleteDialog}
        />
    );
};

EntityManagePermanentDeleteButton.propTypes = {
    disabled: PropTypes.bool
};
