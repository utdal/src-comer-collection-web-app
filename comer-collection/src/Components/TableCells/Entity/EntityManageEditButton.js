import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { EditButton } from "./EditButton.js";
import { useTableRowItem } from "../../../ContextProviders/TableRowProvider.js";
import { useManagementCallbacks } from "../../../ContextProviders/ManagementPageProvider.js";

export const EntityManageEditButton = ({ disabled }) => {
    const item = useTableRowItem();
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
    disabled: PropTypes.bool
};

EntityManageEditButton.defaultProps = {
    disabled: false
};
