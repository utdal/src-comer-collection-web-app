import React from "react";
import PropTypes from "prop-types";
import ItemMultiCreateDialog from "./ItemMultiCreateDialog.js";
import { dialogStatePropTypeShape } from "../../Hooks/useDialogStates.js";
import ItemSingleDeleteDialog from "./ItemSingleDeleteDialog.js";
import ItemSingleEditDialog from "./ItemSingleEditDialog.js";
import UserResetPasswordDialog from "./UserResetPasswordDialog.js";
import UserChangePrivilegesDialog from "./UserChangePrivilegesDialog.js";
import type { DialogState, Intent } from "../../index.js";
import ExhibitionSettingsDialog from "./ExhibitionSettingsDialog.js";
import ImageFullScreenViewerDialog from "./ImageFullScreenViewerDialog.js";

/**
 * This component acts as a switchboard for all the types of dialogs
 * and renders the correct type of dialog based on the "intent" property.
 */
const DialogByIntent = ({ intent, dialogState }: {
    intent: Intent;
    dialogState: DialogState;
}): React.JSX.Element => {
    switch (intent) {
    case "multi-create":
        return <ItemMultiCreateDialog dialogState={dialogState} />;
    case "single-delete":
        return <ItemSingleDeleteDialog dialogState={dialogState} />;
    case "single-edit":
        return <ItemSingleEditDialog dialogState={dialogState} />;
    case "user-reset-password":
        return <UserResetPasswordDialog dialogState={dialogState} />;
    case "user-change-privileges":
        return <UserChangePrivilegesDialog dialogState={dialogState} />;
    case "exhibition-single-create":
    case "exhibition-single-update-settings":
        return <ExhibitionSettingsDialog dialogState={dialogState} />;
    case "image-full-screen-preview":
        return <ImageFullScreenViewerDialog dialogState={dialogState} />;
    default:
        throw new Error(`DialogByIntent received an invalid intent ${intent}`);
    }
};

DialogByIntent.propTypes = {
    dialogState: dialogStatePropTypeShape,
    intent: PropTypes.string
};

export default DialogByIntent;
