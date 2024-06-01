import React, { useCallback, useEffect, useState } from "react";
import {
    Stack, DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography, DialogContentText, Checkbox, ToggleButtonGroup, ToggleButton
} from "@mui/material";
import { SecurityIcon, PersonIcon, CollectionManagerIcon } from "../../Imports/Icons";
import { User } from "../../Classes/Entities/User";
import { useSnackbar } from "../../ContextProviders/AppFeatures";
import { useManagementCallbacks } from "../../ContextProviders/ManagementPageProvider";
import PersistentDialog from "./PersistentDialog";
import type { DialogState, DialogStateSingleUnderlyingItem, UserRole } from "../../index";

interface UserPrivilegeDisplayOption {
    value: UserRole;
    displayText: string;
    caption: string;
    icon: React.ElementType;
    color: "primary" | "secondary";
}

const userPrivilegeOptions = (): UserPrivilegeDisplayOption[] => [
    {
        value: "ADMINISTRATOR",
        displayText: "Administrator",
        caption: "Administrators have full control of the system.  They can manage users, courses, exhibitions, and the collection.  They can also change the access level of other users and revoke your privileges.",
        icon: SecurityIcon as React.ElementType,
        color: "secondary"
    },
    {
        value: "COLLECTION_MANAGER",
        displayText: "Collection Manager",
        caption: "Collection managers can manage images, artists, and tags.  They also have curator privileges.  This role is appropriate for student workers who help manage the collection.",
        icon: CollectionManagerIcon as React.ElementType,
        color: "secondary"
    },
    {
        value: "CURATOR",
        displayText: "Curator",
        caption: "Curators can create and edit their own exhibitions using existing images.  This role is appropriate for most users, including students.",
        icon: PersonIcon as React.ElementType,
        color: "primary"
    }
];

const UserChangePrivilegesDialog = ({ dialogState }: {
    readonly dialogState: DialogState;
}): React.JSX.Element => {
    const [confirmAction, setConfirmAction] = useState(false);
    const [newAccess, setNewAccess] = useState((null as unknown) as UserRole);
    const [submitEnabled, setSubmitEnabled] = useState(true);

    const showSnackbar = useSnackbar();
    const themeColor = newAccess === "CURATOR" ? "primary" : "secondary";

    const { dialogIsOpen, underlyingItem: dialogUser } = dialogState as DialogStateSingleUnderlyingItem;
    const { closeDialogByIntent } = useManagementCallbacks();

    useEffect(() => {
        if (dialogIsOpen) {
            setNewAccess(dialogUser?.access_level as UserRole);
            setSubmitEnabled(true);
            setConfirmAction(false);
        }
    }, [dialogIsOpen, dialogUser?.access_level]);

    const handleChangeNewAccessInput = useCallback((e: React.MouseEvent<HTMLElement>, next: UserRole) => {
        setNewAccess(next);
        setConfirmAction(false);
    }, []);

    const handleChangeConfirmationInput = useCallback((e: React.ChangeEvent<HTMLInputElement>, isChecked: boolean) => {
        setConfirmAction(isChecked);
    }, []);

    const handleClose = useCallback(() => {
        closeDialogByIntent("user-change-privileges");
    }, [closeDialogByIntent]);

    const handleSubmit = useCallback(() => {
        if (dialogUser) {
            setSubmitEnabled(false);
            User.handleChangeUserAccess(dialogUser.id, newAccess).then((msg) => {
                handleClose();
                setConfirmAction(false);
                showSnackbar(msg, "success");
            }).catch((err) => {
                setConfirmAction(false);
                setSubmitEnabled(true);
                showSnackbar((err as Error).message, "error");
            });
        }
    }, [dialogUser, newAccess, handleClose, showSnackbar]);

    return (
        <PersistentDialog
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
                        // required
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

export default UserChangePrivilegesDialog;
