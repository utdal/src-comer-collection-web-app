import React from "react";
import {
    Stack, Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button, Divider,
    Typography, DialogContentText, ToggleButton, ToggleButtonGroup
} from "@mui/material";
import { useAppDarkTheme } from "../../../ContextProviders/AppFeatures.js";
import { DarkModeIcon, LightModeIcon } from "../../../Imports/Icons.js";
import PropTypes from "prop-types";
import { AppSettingsDialogOption } from "./AppSettingsDialogOption.js";

export const AppSettingsDialog = ({ appSettingsDialogIsOpen, setAppSettingsDialogIsOpen }) => {
    const { appDarkTheme, setAppDarkTheme } = useAppDarkTheme();
    return (
        <Dialog
            component="form"
            disableEscapeKeyDown
            onClose={(event, reason) => {
                if (reason === "backdropClick") {
                    return;
                }
                setAppSettingsDialogIsOpen(false);
            }}
            open={appSettingsDialogIsOpen}
            sx={{ zIndex: 10000 }}
        >
            <DialogTitle
                textAlign="center"
                variant="h4"
            >
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
                                onClick={() => {
                                    setAppDarkTheme(false);
                                }}
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
                                onClick={() => {
                                    setAppDarkTheme(true);
                                }}
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
                    onClick={() => {
                        setAppSettingsDialogIsOpen(false);
                    }}
                    sx={{ width: "100%" }}
                    variant="contained"
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

AppSettingsDialog.propTypes = {
    appSettingsDialogIsOpen: PropTypes.bool.isRequired,
    setAppSettingsDialogIsOpen: PropTypes.func.isRequired
};
