import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { Button } from "@mui/material";
import { useManagementCallbacks } from "../../ContextProviders/ManagementPageProvider";

/**
 * Generic dialog cancel button that uses DialogIntent
 * to identify the correct dialog to close.  This only closes the dialog;
 * each dialog should have a useEffect loop to clean up any lingering form inputs.
 * @param {{
 *  dialogIntent: Intent,
 *  displayText: string,
 *  disabled: boolean,
 *  prominent: boolean
 * }} props
 * @returns {React.JSX.Element}
 */
const DialogCancelButton = ({ dialogIntent, displayText = "Cancel", disabled = false, prominent = false }) => {
    const { closeDialogByIntent } = useManagementCallbacks();
    const handleClick = useCallback(() => {
        closeDialogByIntent(dialogIntent);
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

DialogCancelButton.propTypes = {
    dialogIntent: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    displayText: PropTypes.string,
    prominent: PropTypes.bool
};

export default DialogCancelButton;
