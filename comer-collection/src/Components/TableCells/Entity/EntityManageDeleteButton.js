import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { useTableRowItem } from "../../../ContextProviders/TableRowProvider.js";
import { useManagementCallbacks } from "../../../ContextProviders/ManagementPageProvider.js";
import { DeleteButton } from "./DeleteButton.js";

export const EntityManageDeleteButton = ({ disabled }) => {
    const item = useTableRowItem();
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
    disabled: PropTypes.bool
};

EntityManageDeleteButton.defaultProps = {
    disabled: false
};
