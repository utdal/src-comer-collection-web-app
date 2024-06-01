import React, { useCallback } from "react";
import { Button } from "@mui/material";
import { useManagementCallbacks } from "../../ContextProviders/ManagementPageProvider";
import type { Intent } from "../..";

/**
 * Generic dialog cancel button that uses DialogIntent
 * to identify the correct dialog to close.  This only closes the dialog;
 * each dialog should have a useEffect loop to clean up any lingering form inputs.
 */
const DialogCancelButton = ({ dialogIntent, displayText = "Cancel", disabled = false, prominent = false }: {
        readonly dialogIntent: Intent;
        readonly displayText?: string;
        readonly disabled?: boolean;
        readonly prominent?: boolean;
    }): React.JSX.Element => {
    const { closeDialogByIntent } = useManagementCallbacks();
    const handleClick = useCallback(() => {
        if (closeDialogByIntent) {
            closeDialogByIntent(dialogIntent);
        }
    }, [closeDialogByIntent, dialogIntent]);
    return (
        <Button
            color="primary"
            disabled={disabled}
            fullWidth
            onClick={handleClick}
            variant={
                prominent ? "contained" : "outlined"
            }
        >
            {displayText}
        </Button>
    );
};

export default DialogCancelButton;
