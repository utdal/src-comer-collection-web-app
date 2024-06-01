import React from "react";
import ItemMultiCreateDialog from "./ItemMultiCreateDialog";
import ItemSingleDeleteDialog from "./ItemSingleDeleteDialog";
import ItemSingleEditDialog from "./ItemSingleEditDialog";
import UserResetPasswordDialog from "./UserResetPasswordDialog";
import UserChangePrivilegesDialog from "./UserChangePrivilegesDialog";
import type { DialogState, Intent } from "../../index";
import ExhibitionSettingsDialog from "./ExhibitionSettingsDialog";
import ImageFullScreenViewerDialog from "./ImageFullScreenViewerDialog";

/**
 * This component acts as a switchboard for all the types of dialogs
 * and renders the correct type of dialog based on the "intent" property.
 */
const DialogByIntent = ({ intent, dialogState }: {
    readonly intent: Intent;
    readonly dialogState: DialogState;
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

export default DialogByIntent;
