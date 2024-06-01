import React, { useCallback, useEffect, useState } from "react";
import {
    Stack, DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography, DialogContentText, TextField
} from "@mui/material";
import { ContentCopyIcon, SyncIcon } from "../../Imports/Icons.js";
import { useClipboard, useSnackbar } from "../../ContextProviders/AppFeatures";
import PropTypes from "prop-types";
import { DialogStateOld } from "../../Classes/DialogState.js";
import { PersistentDialog } from "./PersistentDialog.js";
import { useActionData, useSubmit } from "react-router-dom";
import { useManagementCallbacks } from "../../ContextProviders/ManagementPageProvider";

const randomPassword = () => {
    const password = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
    return password;
};

/**
 * @param {{ dialogState: DialogState }} props
 */
export const UserResetPasswordDialog = ({ dialogState }) => {
    const [newPassword, setNewPassword] = useState("");
    const [editMode, setEditMode] = useState(true);
    const [hasCopied, setHasCopied] = useState(false);

    const showSnackbar = useSnackbar();
    const clipboard = useClipboard();

    const submit = useSubmit();
    const { closeDialogByIntent } = useManagementCallbacks();

    /**
     * @type {RouterActionResponse}
     */
    const actionData = useActionData();

    const { dialogIsOpen, underlyingItem: dialogUser } = dialogState;

    const themeColor = dialogUser?.is_admin_or_collection_manager ? "secondary" : "primary";

    useEffect(() => {
        if (actionData) {
            if (actionData.status === "success") {
                showSnackbar(actionData.snackbarText, "success");
                setEditMode(false);
            } else if (actionData.status === "error") {
                showSnackbar(actionData.snackbarText, "error");
            }
        }
    }, [actionData, showSnackbar]);

    const handleClose = useCallback(() => {
        closeDialogByIntent("user-reset-password");
    }, [closeDialogByIntent]);

    useEffect(() => {
        if (!dialogIsOpen) {
            handleClose();
        }
        setEditMode(true);
        setHasCopied(false);
        setNewPassword("");
    }, [handleClose, dialogIsOpen]);

    const handleSubmit = useCallback(() => {
        /**
         * @type {RouterActionRequest}
         */
        const request = {
            intent: "user-reset-password",
            userId: dialogUser?.id,
            body: {
                newPassword
            }
        };
        submit(request, {
            method: "PUT",
            encType: "application/json"
        });
    }, [dialogUser?.id, newPassword, submit]);

    const handleNewPasswordInput = useCallback((e) => {
        setNewPassword(e.target.value);
    }, []);

    const handleRandomizePasswordInput = useCallback(() => {
        setNewPassword(randomPassword());
    }, []);

    const handleCopyNewPassword = useCallback(() => {
        clipboard(newPassword);
        setHasCopied(true);
    }, [clipboard, newPassword]);

    return (
        <PersistentDialog
            isForm
            maxWidth="sm"
            onClose={handleClose}
            onSubmit={handleSubmit}
            open={dialogIsOpen}
        >
            <DialogTitle>
                {editMode
                    ? (
                        dialogUser?.has_password ? "Reset Password" : "Set Password"
                    )
                    : (
                        dialogUser?.has_password ? "Password Reset" : "Password Set"
                    )}
            </DialogTitle>

            <DialogContent>
                <Stack
                    direction="column"
                    spacing={2}
                >
                    {(editMode &&
                        <>
                            <DialogContentText variant="body1">
                                {(dialogUser?.has_password &&
                                    `You are about to reset the password for ${dialogUser?.safe_display_name}, which will invalidate all current access tokens for this user.`
                                ) || (!dialogUser?.has_password &&
                                    `You are about to set a password for ${dialogUser?.safe_display_name}.`
                                )}
                            </DialogContentText>

                            <DialogContentText variant="body1">
                                Please type a password of your choice or generate a random password for the user.
                            </DialogContentText>
                        </>
                    ) || (!editMode &&
                        <DialogContentText variant="body1">
                            The new password has been set.  Please copy the password below so you can send it to the user.  You will not be able to see the password again after you close this dialog.
                        </DialogContentText>
                    )}

                    <Stack
                        direction="row"
                        spacing={2}
                    >
                        <TextField
                            color={themeColor}
                            disabled={!editMode}
                            label="New Password"
                            onChange={handleNewPasswordInput}
                            sx={{ width: "80%" }}
                            type="password"
                            value={newPassword}
                        />

                        {(editMode &&
                            <Button
                                color={themeColor}
                                onClick={handleRandomizePasswordInput}
                                startIcon={<SyncIcon />}
                                variant={newPassword ? "outlined" : "contained"}
                            >
                                <Typography>
                                    Random
                                </Typography>
                            </Button>
                        ) || (!editMode &&
                            <Button
                                color={themeColor}
                                onClick={handleCopyNewPassword}
                                startIcon={<ContentCopyIcon />}
                                variant={hasCopied ? "outlined" : "contained"}
                            >
                                <Typography>
                                    Copy
                                </Typography>
                            </Button>
                        )}
                    </Stack>
                </Stack>
            </DialogContent>

            <DialogActions>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    spacing={1}
                    sx={{ width: "100%" }}
                >
                    {(editMode &&
                        <>
                            <Button
                                color={themeColor}
                                fullWidth
                                onClick={handleClose}
                                variant="outlined"
                            >
                                Cancel
                            </Button>

                            <Button
                                color={themeColor}
                                disabled={!newPassword}
                                fullWidth
                                size="large"
                                type="submit"
                                variant="contained"
                            >
                                {dialogUser?.has_password ? "Reset Password" : "Set Password"}
                            </Button>
                        </>
                    ) || (!editMode &&
                        <Button
                            color={themeColor}
                            disabled={!hasCopied}
                            fullWidth
                            onClick={handleClose}
                            size="large"
                            variant="contained"
                        >
                            Close
                        </Button>
                    )}
                </Stack>
            </DialogActions>
        </PersistentDialog>
    );
};

UserResetPasswordDialog.propTypes = {
    dialogState: PropTypes.instanceOf(DialogStateOld).isRequired
};
