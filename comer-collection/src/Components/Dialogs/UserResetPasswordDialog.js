import React, { useCallback, useEffect, useState } from "react";
import {
    Stack, Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography, DialogContentText, TextField
} from "@mui/material";
import { ContentCopyIcon, SyncIcon } from "../../Imports/Icons.js";
import { useClipboard, useSnackbar } from "../../ContextProviders/AppFeatures.js";
import { User } from "../../Classes/Entities/User.js";
import { dialogStatePropTypesShape } from "../../Pages/Admin/useDialogState.js";
import { useManagementCallbacks } from "../../ContextProviders/ManagementPageProvider.js";

const randomPassword = () => {
    const password = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
    return password;
};

export const UserResetPasswordDialog = ({ dialogState }) => {
    const [newPassword, setNewPassword] = useState("");
    const [editMode, setEditMode] = useState(true);
    const [hasCopied, setHasCopied] = useState(false);

    const showSnackbar = useSnackbar();
    const clipboard = useClipboard();

    const { handleRefresh } = useManagementCallbacks();

    if (dialogState.Entity !== User) {
        throw new Error("Dialog state entity must be User");
    }

    const {
        dialogItem: dialogUser,
        dialogIsOpen,
        closeDialog
    } = dialogState;

    const themeColor = dialogUser?.is_admin_or_collection_manager ? "secondary" : "primary";

    useEffect(() => {
        if (!dialogIsOpen) {
            closeDialog();
            setEditMode(true);
            setHasCopied(false);
            setNewPassword("");
        }
    }, [closeDialog, dialogIsOpen]);

    const handleClose = useCallback((event, reason) => {
        if (reason === "backdropClick") {
            return;
        }
        closeDialog();
    }, [closeDialog]);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        User.handleResetPassword(dialogUser?.id, newPassword).then((msg) => {
            handleRefresh();
            setEditMode(false);
            showSnackbar(msg, "success");
        }).catch((err) => {
            showSnackbar(err, "error");
        });
    }, [dialogUser?.id, handleRefresh, newPassword, showSnackbar]);

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
        <Dialog
            component="form"
            disableEscapeKeyDown
            fullWidth
            maxWidth="sm"
            onClose={handleClose}
            onSubmit={handleSubmit}
            open={dialogIsOpen}
            sx={{ zIndex: 10000 }}
        >
            <DialogTitle
                textAlign="center"
                variant="h4"
            >
                {dialogUser?.has_password ? "Reset Password" : "Set Password"}
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
                                onClick={handleClose}
                                sx={{ width: "100%" }}
                                variant="outlined"
                            >
                                <Typography variant="body1">
                                    Cancel
                                </Typography>
                            </Button>

                            <Button
                                color={themeColor}
                                disabled={!newPassword}
                                size="large"
                                sx={{ width: "100%" }}
                                type="submit"
                                variant="contained"
                            >
                                <Typography variant="body1">
                                    {dialogUser?.has_password ? "Reset Password" : "Set Password"}
                                </Typography>
                            </Button>
                        </>
                    ) || (!editMode &&
                        <Button
                            color={themeColor}
                            disabled={!hasCopied}
                            onClick={handleClose}
                            size="large"
                            sx={{ width: "100%" }}
                            variant="contained"
                        >
                            <Typography variant="body1">
                                Close
                            </Typography>
                        </Button>
                    )}
                </Stack>
            </DialogActions>
        </Dialog>
    );
};

UserResetPasswordDialog.propTypes = {
    dialogState: dialogStatePropTypesShape.isRequired
};
