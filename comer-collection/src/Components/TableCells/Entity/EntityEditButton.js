import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { IconButton } from "@mui/material";
import { EditIcon } from "../../../Imports/Icons.js";
import { useTableCellItem, useTableCellManagementCallbacks } from "../../../ContextProviders/TableCellProvider.js";

const EntityEditButton = ({ disabled = false }) => {
    const item = useTableCellItem();
    const { openDialogByIntentWithSingleUnderlyingItem } = useTableCellManagementCallbacks();
    const handleOpenEditDialog = useCallback(() => {
        openDialogByIntentWithSingleUnderlyingItem("single-edit", item);
    }, [openDialogByIntentWithSingleUnderlyingItem, item]);
    return (
        <IconButton
            disabled={disabled}
            onClick={handleOpenEditDialog}
        >
            <EditIcon />
        </IconButton>
    );
};

EntityEditButton.propTypes = {
    disabled: PropTypes.bool
};

export default EntityEditButton;
