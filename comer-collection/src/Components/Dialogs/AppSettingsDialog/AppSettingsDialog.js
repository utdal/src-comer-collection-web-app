import React, { useCallback } from "react";
import {
    Stack, DialogTitle,
    DialogContent,
    DialogActions,
    Button, Divider,
    Typography, DialogContentText, ToggleButton, ToggleButtonGroup
} from "@mui/material";
import { useAppDarkTheme } from "../../../ContextProviders/AppTheme.js";
import { DarkModeIcon, LightModeIcon } from "../../../Imports/Icons.js";
import PropTypes from "prop-types";
import { AppSettingsDialogOption } from "./AppSettingsDialogOption.js";
import { PersistentDialog } from "../PersistentDialog.js";
import { DialogState } from "../../../Classes/DialogState.js";

/**
 * @param {{
 *  dialogState: DialogState
 * }} props
 */
export const AppSettingsDialog = ({ dialogState }) => {
    const { appDarkTheme, setAppDarkTheme } = useAppDarkTheme();
    const { closeDialog, dialogIsOpen } = dialogState;

    const handleSwitchToLightTheme = useCallback(() => {
        setAppDarkTheme(false);
    }, [setAppDarkTheme]);

    const handleSwitchToDarkTheme = useCallback(() => {
        setAppDarkTheme(true);
    }, [setAppDarkTheme]);

    return (
        <PersistentDialog
            onClose={closeDialog}
            open={dialogIsOpen}
        >
            <DialogTitle>
                Application Settings
            </DialogTitle>

            <DialogContent>
                <Stack spacing={2}>
                    <DialogContentText variant="body1">
                        These settings are stored and applied in this browser only.
                    </DialogContentText>

                    <Divider />

                    <AppSettingsDialogOption description="Application Theme">
                        <ToggleButtonGroup
                            required
                            value={appDarkTheme}
                        >
                            <ToggleButton
                                onClick={handleSwitchToLightTheme}
                                value={false}
                            >
                                <Stack
                                    alignItems="center"
                                    direction="row"
                                    spacing={1}
                                >
                                    <LightModeIcon fontSize="medium" />

                                    <Typography>
                                        Light
                                    </Typography>
                                </Stack>
                            </ToggleButton>

                            <ToggleButton
                                onClick={handleSwitchToDarkTheme}
                                value
                            >
                                <Stack
                                    alignItems="center"
                                    direction="row"
                                    spacing={1}
                                >
                                    <DarkModeIcon fontSize="medium" />

                                    <Typography>
                                        Dark
                                    </Typography>
                                </Stack>
                            </ToggleButton>
                        </ToggleButtonGroup>

                    </AppSettingsDialogOption>

                </Stack>
            </DialogContent>

            <DialogActions>
                <Button
                    color="primary"
                    fullWidth
                    onClick={closeDialog}
                    variant="contained"
                >
                    Close
                </Button>
            </DialogActions>
        </PersistentDialog>
    );
};

AppSettingsDialog.propTypes = {
    dialogState: PropTypes.instanceOf(DialogState)
};
