import React, { useCallback, useEffect, useState } from "react";
import {
    Stack, DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography, DialogContentText, Checkbox, ToggleButtonGroup, ToggleButton
} from "@mui/material";
import { SecurityIcon, PersonIcon, CollectionManagerIcon } from "../../Imports/Icons.js";
import { User } from "../../Classes/Entities/User.ts";
import { useSnackbar } from "../../ContextProviders/AppFeatures";
import { useManagementCallbacks } from "../../ContextProviders/ManagementPageProvider.js";
import { DialogStateOld } from "../../Classes/DialogState.js";
import PropTypes from "prop-types";
import { PersistentDialog } from "./PersistentDialog.js";

const userPrivilegeOptions = () => [
    {
        value: "ADMINISTRATOR",
        displayText: "Administrator",
        caption: "Administrators have full control of the system.  They can manage users, courses, exhibitions, and the collection.  They can also change the access level of other users and revoke your privileges.",
        icon: SecurityIcon,
        color: "secondary"
    },
    {
        value: "COLLECTION_MANAGER",
        displayText: "Collection Manager",
        caption: "Collection managers can manage images, artists, and tags.  They also have curator privileges.  This role is appropriate for student workers who help manage the collection.",
        icon: CollectionManagerIcon,
        color: "secondary"
    },
    {
        value: "CURATOR",
        displayText: "Curator",
        caption: "Curators can create and edit their own exhibitions using existing images.  This role is appropriate for most users, including students.",
        icon: PersonIcon,
        color: "primary"
    }
];

/**
 * @param {{ dialogState: DialogStateOld }} props
 */
export const UserChangePrivilegesDialog = ({ dialogState }) => {
    const [confirmAction, setConfirmAction] = useState(false);
    const [newAccess, setNewAccess] = useState(null);
    const [submitEnabled, setSubmitEnabled] = useState(true);

    const showSnackbar = useSnackbar();
    const themeColor = newAccess === "CURATOR" ? "primary" : "secondary";

    const { handleRefresh } = useManagementCallbacks();

    const { dialogItem: dialogUser, dialogIsOpen, closeDialog } = dialogState;

    useEffect(() => {
        if (dialogIsOpen) {
            setNewAccess(dialogUser?.access_level);
            setSubmitEnabled(true);
            setConfirmAction(false);
        }
    }, [dialogIsOpen, dialogUser?.access_level]);

    const handleChangeNewAccessInput = useCallback((e, next) => {
        if (next) {
            setNewAccess(next);
            setConfirmAction(false);
        }
    }, []);

    const handleChangeConfirmationInput = useCallback((e) => {
        setConfirmAction(e.target.checked);
    }, []);

    const handleClose = useCallback((event, reason) => {
        if (reason === "backdropClick") {
            return;
        }
        closeDialog();
    }, [closeDialog]);

    const handleSubmit = useCallback(() => {
        if (dialogUser) {
            setSubmitEnabled(false);
            User.handleChangeUserAccess(dialogUser.id, newAccess).then((msg) => {
                closeDialog();
                setConfirmAction(false);
                handleRefresh();
                showSnackbar(msg, "success");
            }).catch((err) => {
                setConfirmAction(false);
                setSubmitEnabled(true);
                showSnackbar(err, "error");
            });
        }
    }, [closeDialog, dialogUser, newAccess, handleRefresh, showSnackbar]);

    return (
        <PersistentDialog
            isForm
            maxWidth="sm"
            onClose={handleClose}
            onSubmit={handleSubmit}
            open={dialogIsOpen}
        >
            <DialogTitle>
                Set Access Level for
                {" "}

                <i>
                    {dialogUser?.safe_display_name}
                </i>
            </DialogTitle>

            <DialogContent>
                <Stack
                    direction="column"
                    spacing={2}
                >
                    <ToggleButtonGroup
                        exclusive
                        onChange={handleChangeNewAccessInput}
                        orientation="vertical"
                        required
                        value={newAccess}
                    >
                        {userPrivilegeOptions().map((option) => (
                            <ToggleButton
                                color={option.color}
                                disabled={!submitEnabled}
                                key={option.value}
                                sx={{ textTransform: "unset", minHeight: "100px" }}
                                value={option.value}
                            >
                                <Stack
                                    alignItems="center"
                                    direction="row"
                                    paddingLeft={1}
                                    spacing={2}
                                >
                                    <option.icon fontSize="large" />

                                    <Stack
                                        direction="column"
                                        justifyContent="left"
                                        sx={{ width: "460px" }}
                                    >
                                        <Typography
                                            color="white"
                                            fontWeight="bold"
                                        >
                                            {option.displayText}
                                        </Typography>

                                        <Typography
                                            color="white"
                                            sx={{ opacity: 0.5 }}
                                        >
                                            {option.caption}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </ToggleButton>
                        ))}
                    </ToggleButtonGroup>

                    <Stack
                        alignItems="center"
                        direction="row"
                        spacing={1}
                    >
                        <Checkbox
                            checked={confirmAction}
                            color={themeColor}
                            disabled={!submitEnabled || newAccess === dialogUser?.access_level}
                            onChange={handleChangeConfirmationInput}
                            size="large"
                        />

                        <DialogContentText variant="body1">
                            Please check the box to confirm this operation.
                        </DialogContentText>
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
                    <Button
                        color={themeColor}
                        disabled={!submitEnabled}
                        fullWidth
                        onClick={handleClose}
                        variant="outlined"
                    >
                        Cancel
                    </Button>

                    <Button
                        color={themeColor}
                        disabled={!confirmAction || !submitEnabled || newAccess === dialogUser?.access_level}
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                    >
                        Change Access
                    </Button>
                </Stack>
            </DialogActions>
        </PersistentDialog>
    );
};

UserChangePrivilegesDialog.propTypes = {
    dialogState: PropTypes.instanceOf(DialogStateOld).isRequired
};
