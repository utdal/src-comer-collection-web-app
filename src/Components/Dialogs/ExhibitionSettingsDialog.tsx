import React, { useCallback, useEffect, useState } from "react";
import {
    Stack, DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography, DialogContentText, TextField, ToggleButtonGroup, ToggleButton
} from "@mui/material";
import { SaveIcon, PublicIcon, LockIcon, VpnLockIcon } from "../../Imports/Icons.js";
import { useSnackbar } from "../../ContextProviders/AppFeatures.js";
import PersistentDialog from "./PersistentDialog.js";
import { useActionData, useSubmit } from "react-router-dom";
import type { DialogState, DialogStateNoUnderlyingItems, DialogStateSingleUnderlyingItem, ExhibitionItem, ExhibitionPrivacy, RouterActionRequest, RouterActionResponse } from "../../index.js";
import { useEntity, useManagementCallbacks } from "../../ContextProviders/ManagementPageProvider.js";
import { Exhibition, MyExhibition } from "../../Classes/Entities/Exhibition.js";

interface ExhibitionAccessDisplayOption {
    value: ExhibitionPrivacy;
    displayText: string;
    caption: string;
    icon: React.ElementType;
}

const exhibitionAccessOptions = (adminMode: boolean): ExhibitionAccessDisplayOption[] => [
    {
        value: "PRIVATE",
        displayText: "Private",
        caption: adminMode
            ? "Only the owner, you, and other administrators will be able to access this exhibition."
            : "Only you and administrators will be able to access this exhibition.",
        icon: LockIcon as React.ElementType
    },
    {
        value: "PUBLIC_ANONYMOUS",
        displayText: "Public Anonymous",
        caption: adminMode
            ? "This exhibition will be visible to the public, but the owner's name will not be displayed to anyone except the owner and administrators."
            : "This exhibition will be visible to the public, but your name will not be displayed to anyone except you and administrators.",
        icon: VpnLockIcon as React.ElementType
    },
    {
        value: "PUBLIC",
        displayText: "Public",
        caption: adminMode
            ? "This exhibition will be visible to the public, and the owner's full name will be visible to anyone who views the exhibition.  The owner's email address and course enrollments will never be displayed publicly."
            : "This exhibition will be visible to the public, and your full name will be visible to anyone who views the exhibition.  Your email address and course enrollments will never be displayed publicly.",
        icon: PublicIcon as React.ElementType
    }
];

const ExhibitionSettingsDialog = ({ dialogState }: {
    readonly dialogState: DialogState;
}): React.JSX.Element => {
    const showSnackbar = useSnackbar();

    const Entity = useEntity();
    if (Entity !== Exhibition && Entity !== MyExhibition) {
        throw new Error("ExhibitionSettingsDialog must be used only with the Exhibition entity or sub-classes");
    }

    const adminMode = Entity === Exhibition;

    const { dialogIsOpen, dialogItemsMultiplicity } = dialogState as DialogStateNoUnderlyingItems | DialogStateSingleUnderlyingItem;
    const dialogExhibition = dialogItemsMultiplicity === "single" ? (dialogState as DialogStateSingleUnderlyingItem).underlyingItem as ExhibitionItem : null;

    const { closeDialogByIntent } = useManagementCallbacks();

    const [dialogExhibitionTitle, setDialogExhibitionTitle] = useState(dialogExhibition?.title ?? "");
    const [dialogExhibitionPrivacy, setDialogExhibitionPrivacy] = useState(dialogExhibition?.privacy ?? "PRIVATE");

    // const handleExhibitionCreate = useCallback((title, privacy) => {
    //     MyExhibition.handleMultiCreate([{
    //         title, privacy
    //     }]).then((exhibitionPromises) => {
    //         const [{ status }] = exhibitionPromises;
    //         if (status === "fulfilled") {
    //             setDialogIsOpen(false);
    //             setDialogExhibitionId(null);
    //             setDialogExhibitionTitle("");
    //             setDialogExhibitionAccess(null);
    //             showSnackbar("Successfully created exhibition", "success");
    //         } else {
    //             throw new Error("Could not create exhibition");
    //         }
    //     }).catch((err) => {
    //         showSnackbar(err.message, "error");
    //     }).finally(() => {
    //         refreshFunction();
    //     });
    // }, [refreshFunction, setDialogExhibitionAccess, setDialogExhibitionId, setDialogExhibitionTitle, setDialogIsOpen, showSnackbar]);

    // const handleExhibitionEdit = useCallback((exhibitionId, title, privacy) => {
    //     const ExhibitionClass = adminMode ? Exhibition : MyExhibition;
    //     ExhibitionClass.handleEdit(exhibitionId, {
    //         title, privacy
    //     }).then((msg) => {
    //         setDialogIsOpen(false);
    //         setDialogExhibitionId(null);
    //         setDialogExhibitionTitle("");
    //         setDialogExhibitionAccess(null);
    //         showSnackbar(msg, "success");
    //     }).catch((err) => {
    //         showSnackbar(err.message, "error");
    //     }).finally(() => {
    //         refreshFunction();
    //     });
    // }, [adminMode, refreshFunction, setDialogExhibitionAccess, setDialogExhibitionId, setDialogExhibitionTitle, setDialogIsOpen, showSnackbar]);

    const submit = useSubmit();
    const actionData = useActionData() as RouterActionResponse | null;

    const handleFormSubmit = useCallback(() => {
        if (dialogItemsMultiplicity === "single" && dialogExhibition != null) {
            const request: RouterActionRequest = {
                intent: "exhibition-single-update-settings",
                body: {
                    newTitle: dialogExhibitionTitle,
                    newPrivacy: dialogExhibitionPrivacy
                },
                exhibitionId: dialogExhibition.id
            };
            submit(JSON.stringify(request), {
                encType: "application/json",
                method: "PUT"
            });
        } else if (dialogItemsMultiplicity === "none" && dialogExhibition == null) {
            const request: RouterActionRequest = {
                intent: "exhibition-single-create",
                body: {
                    title: dialogExhibitionTitle,
                    privacy: dialogExhibitionPrivacy
                }
            };
            submit(JSON.stringify(request), {
                encType: "application/json",
                method: "POST"
            });
            // handleExhibitionCreate(dialogExhibitionTitle, dialogExhibitionAccess);
        }
    }, [dialogItemsMultiplicity, dialogExhibition, dialogExhibitionTitle, dialogExhibitionPrivacy, submit]);

    const handleClose = useCallback(() => {
        switch (dialogItemsMultiplicity) {
        case "none":
            closeDialogByIntent("exhibition-single-create");
            break;
        case "single":
            closeDialogByIntent("exhibition-single-update-settings");
            break;
        default:
            break;
        }
    }, [closeDialogByIntent, dialogItemsMultiplicity]);

    useEffect(() => {
        if (actionData) {
            if (actionData.status === "success") {
                showSnackbar(actionData.snackbarText, "success");
                handleClose();
            } else if (actionData.status === "error") {
                showSnackbar(actionData.snackbarText, "error");
            }
        }
    }, [actionData, showSnackbar, handleClose]);

    return (
        <PersistentDialog
            onClose={handleClose}
            onSubmit={handleFormSubmit}
            open={dialogIsOpen}
        >
            <DialogTitle>
                {dialogItemsMultiplicity === "single" ? "Edit Exhibition" : "Create Exhibition"}
            </DialogTitle>

            <DialogContent>
                <Stack spacing={2}>
                    <DialogContentText>
                        {
                            adminMode
                                ? "Set the title and access level for this exhibition.  These fields can be changed later by you or the owner."
                                : "Set the title and access level for your exhibition.  These fields can be changed later by you or your instructor/administrator."
                        }
                    </DialogContentText>

                    <TextField
                        label="Exhibition Title"
                        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
                            setDialogExhibitionTitle(e.target.value);
                        }}
                        required
                        value={dialogExhibitionTitle}
                    />

                    <DialogContentText variant="body1">
                        {
                            adminMode
                                ? "Note that the privacy settings below will have no effect if you include the owner's personal information in the exhibition title.  The owner's name will remain visible to you and other administrators regardless of this setting."
                                : "Note that the privacy settings below will have no effect if you include personal information in the exhibition title.  Your instructor/administrator will be able to see your name regardless of this setting."
                        }
                    </DialogContentText>

                    <ToggleButtonGroup
                        exclusive
                        onChange={(e: React.MouseEvent<HTMLElement>, next: ExhibitionPrivacy | null): void => {
                            if (next) {
                                setDialogExhibitionPrivacy(next);
                            }
                        }}
                        orientation="vertical"
                        value={dialogExhibitionPrivacy}
                    >
                        {exhibitionAccessOptions(Boolean(adminMode)).map((option) => (
                            <ToggleButton
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
                                        width="460px"
                                    >
                                        <Typography fontWeight="bold">
                                            {option.displayText}
                                        </Typography>

                                        <Typography sx={{ opacity: 0.5 }}>
                                            {option.caption}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </ToggleButton>
                        ))}
                    </ToggleButtonGroup>
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
                        color="primary"
                        fullWidth
                        onClick={handleClose}
                        variant="outlined"
                    >
                        Cancel
                    </Button>

                    <Button
                        color="primary"
                        disabled={!dialogExhibitionTitle}
                        fullWidth
                        size="large"
                        startIcon={<SaveIcon />}
                        type="submit"
                        variant="contained"
                    >
                        {dialogItemsMultiplicity === "single" ? "Save Settings" : "Create Exhibition"}
                    </Button>
                </Stack>
            </DialogActions>
        </PersistentDialog>
    );
};

export default ExhibitionSettingsDialog;
