import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { useManagementCallbacks } from "../../../ContextProviders/ManagementPageProvider.js";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider.js";
import { RestoreButton } from "./RestoreButton.js";

export const EntityManageRestoreButton = ({ disabled = false }) => {
    const item = useTableCellItem();
    const { handleOpenEntityRestoreDialog } = useManagementCallbacks();
    const handleOpenRestoreDialog = useCallback(() => {
        handleOpenEntityRestoreDialog(item);
    }, [handleOpenEntityRestoreDialog, item]);
    return (
        <RestoreButton
            disabled={disabled}
            onClick={handleOpenRestoreDialog}
        />
    );
};

EntityManageRestoreButton.propTypes = {
    disabled: PropTypes.bool
};
