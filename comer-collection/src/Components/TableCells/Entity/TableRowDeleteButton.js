import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { IconButton } from "@mui/material";
import { DeleteIcon } from "../../../Imports/Icons.js";
import { useTableCellItem, useTableCellManagementCallbacks } from "../../../ContextProviders/TableCellProvider.js";

const TableRowDeleteButton = ({ disabled = false }) => {
    const item = useTableCellItem();
    const { openDialogByIntentWithSingleUnderlyingItem } = useTableCellManagementCallbacks();
    const handleOpenDeleteDialog = useCallback(() => {
        openDialogByIntentWithSingleUnderlyingItem("single-delete", item);
    }, [openDialogByIntentWithSingleUnderlyingItem, item]);
    return (
        <IconButton
            disabled={disabled}
            onClick={handleOpenDeleteDialog}
        >
            <DeleteIcon />
        </IconButton>
    );
};

TableRowDeleteButton.propTypes = {
    disabled: PropTypes.bool
};

export default TableRowDeleteButton;
