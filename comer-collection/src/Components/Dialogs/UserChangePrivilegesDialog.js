import React, { useEffect, useState } from "react";
import {
    Stack, Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography, DialogContentText, Checkbox, ToggleButtonGroup, ToggleButton
} from "@mui/material";
import { SecurityIcon, PersonIcon, CollectionManagerIcon } from "../../Imports/Icons.js";
import PropTypes from "prop-types";
import { User } from "../../Classes/Entities/User.js";
import { useSnackbar } from "../../ContextProviders/AppFeatures.js";
import { entityPropTypeShape } from "../../Classes/Entity.js";

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

export const UserChangePrivilegesDialog = ({ dialogUser, dialogIsOpen, setDialogIsOpen, refreshAllItems }) => {
    const [confirmAction, setConfirmAction] = useState(false);
    const [newAccess, setNewAccess] = useState(null);
    const [submitEnabled, setSubmitEnabled] = useState(true);

    const showSnackbar = useSnackbar();

    const themeColor = newAccess === "CURATOR" ? "primary" : "secondary";

    useEffect(() => {
        if (dialogIsOpen) {
            setNewAccess(dialogUser?.access_level);
            setSubmitEnabled(true);
            setConfirmAction(false);
        }
    }, [dialogUser, dialogIsOpen]);

    return (
        <Dialog
            component="form"
            disableEscapeKeyDown
            fullWidth
            maxWidth="sm"
            onClose={(event, reason) => {
                if (reason === "backdropClick") { return; }
                setDialogIsOpen(false);
                setConfirmAction(false);
            }}
            onSubmit={(e) => {
                e.preventDefault();
                setSubmitEnabled(false);
                User.handleChangeUserAccess(dialogUser.id, newAccess).then((msg) => {
                    setDialogIsOpen(false);
                    setConfirmAction(false);
                    refreshAllItems();
                    showSnackbar(msg, "success");
                }).catch((err) => {
                    setConfirmAction(false);
                    setSubmitEnabled(true);
                    showSnackbar(err, "error");
                });
            }}
            open={dialogIsOpen}
            sx={{ zIndex: 10000 }}
        >
            <DialogTitle
                textAlign="center"
                variant="h4"
            >
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
                        onChange={(e, next) => {
                            if (next) {
                                setNewAccess(next);
                                setConfirmAction(false);
                            }
                        }}
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
                            onChange={(e) => {
                                setConfirmAction(e.target.checked);
                            }}
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
                        onClick={() => {
                            setDialogIsOpen(false);
                            setConfirmAction(false);
                        }}
                        sx={{ width: "100%" }}
                        variant="outlined"
                    >
                        <Typography variant="body1">
                            Cancel
                        </Typography>
                    </Button>

                    <Button
                        color={themeColor}
                        disabled={!confirmAction || !submitEnabled || newAccess === dialogUser?.access_level}
                        size="large"
                        sx={{ width: "100%" }}
                        type="submit"
                        variant="contained"
                    >
                        <Typography variant="body1">
                            Change Access
                        </Typography>
                    </Button>
                </Stack>
            </DialogActions>
        </Dialog>
    );
};

UserChangePrivilegesDialog.propTypes = {
    dialogIsOpen: PropTypes.bool.isRequired,
    dialogUser: PropTypes.shape(entityPropTypeShape).isRequired,
    refreshAllItems: PropTypes.func.isRequired,
    setDialogIsOpen: PropTypes.func.isRequired
};
