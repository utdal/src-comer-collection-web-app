import React from "react";
import PropTypes from "prop-types";
import { ItemMultiCreateDialog } from "./ItemMultiCreateDialog.js";
import { dialogStatePropTypeShape } from "../../Hooks/useDialogStates.js";
import { ItemSingleDeleteDialog } from "./ItemSingleDeleteDialog.js";
import { ItemSingleEditDialog } from "./ItemSingleEditDialog.js";
import { UserResetPasswordDialog } from "./UserResetPasswordDialog.js";
import { UserChangePrivilegesDialog } from "./UserChangePrivilegesDialog.js";

/**
 * This component acts as a switchboard for all the types of dialogs
 * and renders the correct type of dialog based on the "intent" property.
 * @param {{intent: import("../../Router/buildRouterActionByEntity.js").Intent, dialogState: import("../../Hooks/useDialogStates").DialogState}} props
 * @returns {React.JSX.Element}
 */
const DialogByIntent = ({ intent, dialogState }) => {
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
    default:
        console.warn(`DialogByIntent received an invalid intent ${intent}`);
        return null;
    }
};

DialogByIntent.propTypes = {
    dialogState: dialogStatePropTypeShape,
    intent: PropTypes.string
};

export default DialogByIntent;
