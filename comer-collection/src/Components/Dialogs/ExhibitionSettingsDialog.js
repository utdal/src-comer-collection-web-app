import React, { useCallback } from "react";
import {
    Stack, DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography, DialogContentText, TextField, ToggleButtonGroup, ToggleButton
} from "@mui/material";
import { SaveIcon, PublicIcon, LockIcon, VpnLockIcon } from "../../Imports/Icons.js";
import PropTypes from "prop-types";
import { Exhibition, MyExhibition } from "../../Classes/Entities/Exhibition.js";
import { useSnackbar } from "../../ContextProviders/AppFeatures.js";
import { PersistentDialog } from "./PersistentDialog.js";

const exhibitionAccessOptions = (adminMode) => [
    {
        value: "PRIVATE",
        displayText: "Private",
        caption: adminMode
            ? "Only the owner, you, and other administrators will be able to access this exhibition."
            : "Only you and administrators will be able to access this exhibition.",
        icon: LockIcon
    },
    {
        value: "PUBLIC_ANONYMOUS",
        displayText: "Public Anonymous",
        caption: adminMode
            ? "This exhibition will be visible to the public, but the owner's name will not be displayed to anyone except the owner and administrators."
            : "This exhibition will be visible to the public, but your name will not be displayed to anyone except you and administrators.",
        icon: VpnLockIcon
    },
    {
        value: "PUBLIC",
        displayText: "Public",
        caption: adminMode
            ? "This exhibition will be visible to the public, and the owner's full name will be visible to anyone who views the exhibition.  The owner's email address and course enrollments will never be displayed publicly."
            : "This exhibition will be visible to the public, and your full name will be visible to anyone who views the exhibition.  Your email address and course enrollments will never be displayed publicly.",
        icon: PublicIcon
    }
];

export const ExhibitionSettingsDialog = ({ editMode, adminMode, dialogIsOpen, setDialogIsOpen, dialogExhibitionId, dialogExhibitionTitle, dialogExhibitionAccess, setDialogExhibitionId, setDialogExhibitionTitle, setDialogExhibitionAccess, refreshFunction }) => {
    const showSnackbar = useSnackbar();

    const handleExhibitionCreate = useCallback((title, privacy) => {
        MyExhibition.handleMultiCreate([{
            title, privacy
        }]).then((exhibitionPromises) => {
            const [{ status }] = exhibitionPromises;
            if (status === "fulfilled") {
                setDialogIsOpen(false);
                setDialogExhibitionId(null);
                setDialogExhibitionTitle("");
                setDialogExhibitionAccess(null);
                showSnackbar("Successfully created exhibition", "success");
            } else {
                throw new Error("Could not create exhibition");
            }
        }).catch((err) => {
            showSnackbar(err.message, "error");
        }).finally(() => {
            refreshFunction();
        });
    }, [refreshFunction, setDialogExhibitionAccess, setDialogExhibitionId, setDialogExhibitionTitle, setDialogIsOpen, showSnackbar]);

    const handleExhibitionEdit = useCallback((exhibitionId, title, privacy) => {
        const ExhibitionClass = adminMode ? Exhibition : MyExhibition;
        ExhibitionClass.handleEdit(exhibitionId, {
            title, privacy
        }).then((msg) => {
            setDialogIsOpen(false);
            setDialogExhibitionId(null);
            setDialogExhibitionTitle("");
            setDialogExhibitionAccess(null);
            showSnackbar(msg, "success");
        }).catch((err) => {
            showSnackbar(err.message, "error");
        }).finally(() => {
            refreshFunction();
        });
    }, [adminMode, refreshFunction, setDialogExhibitionAccess, setDialogExhibitionId, setDialogExhibitionTitle, setDialogIsOpen, showSnackbar]);

    const handleFormSubmit = useCallback(() => {
        if (editMode) {
            handleExhibitionEdit(dialogExhibitionId, dialogExhibitionTitle, dialogExhibitionAccess);
        } else {
            handleExhibitionCreate(dialogExhibitionTitle, dialogExhibitionAccess);
        }
    }, [dialogExhibitionAccess, dialogExhibitionId, dialogExhibitionTitle, editMode, handleExhibitionCreate, handleExhibitionEdit]);

    return (
        <PersistentDialog
            isForm
            onClose={() => {
                setDialogIsOpen(false);
            }}
            onSubmit={handleFormSubmit}
            open={dialogIsOpen}
        >
            <DialogTitle>
                {editMode ? "Edit Exhibition" : "Create Exhibition"}
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
                        onChange={(e) => {
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
                        onChange={(e, next) => {
                            setDialogExhibitionAccess(next);
                        }}
                        orientation="vertical"
                        required
                        value={dialogExhibitionAccess}
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

                                    <Stack direction="column">
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
                        onClick={() => {
                            setDialogIsOpen(false);
                            setDialogExhibitionAccess(null);
                            setDialogExhibitionTitle("");
                        }}
                        variant="outlined"
                    >
                        Cancel
                    </Button>

                    <Button
                        color="primary"
                        disabled={!(dialogExhibitionAccess && dialogExhibitionTitle)}
                        fullWidth
                        size="large"
                        startIcon={<SaveIcon />}
                        type="submit"
                        variant="contained"
                    >
                        {editMode ? "Save Settings" : "Create Exhibition"}
                    </Button>
                </Stack>
            </DialogActions>
        </PersistentDialog>
    );
};

ExhibitionSettingsDialog.propTypes = {
    adminMode: PropTypes.bool,
    dialogExhibitionAccess: PropTypes.string,
    dialogExhibitionId: PropTypes.number,
    dialogExhibitionTitle: PropTypes.string,
    dialogIsOpen: PropTypes.bool.isRequired,
    editMode: PropTypes.bool.isRequired,
    refreshFunction: PropTypes.func.isRequired,
    setDialogExhibitionAccess: PropTypes.func.isRequired,
    setDialogExhibitionId: PropTypes.func.isRequired,
    setDialogExhibitionTitle: PropTypes.func.isRequired,
    setDialogIsOpen: PropTypes.func.isRequired
};
