import React from "react";
import {
    Stack, Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button, Divider,
    Typography, DialogContentText, ToggleButton, ToggleButtonGroup
} from "@mui/material";
import { useAppDarkTheme, useAppSettingsDialog } from "../../ContextProviders/AppFeatures.js";
import { DarkModeIcon, LightModeIcon } from "../../Imports/Icons.js";
import PropTypes from "prop-types";


const Option = ({ description, children }) => {
    return (
        <>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <DialogContentText variant="body1">{description}</DialogContentText>
                {children}
            </Stack>
        </>
    );
};

Option.propTypes = {
    description: PropTypes.string,
    children: PropTypes.node
};


export const AppSettingsDialog = () => {
    const { appSettingsDialogIsOpen, setAppSettingsDialogIsOpen } = useAppSettingsDialog();
    const { appDarkTheme, setAppDarkTheme } = useAppDarkTheme();
    return (
        <Dialog component="form" sx={{ zIndex: 10000 }}
            open={appSettingsDialogIsOpen} disableEscapeKeyDown
            onClose={(event, reason) => {
                if (reason == "backdropClick")
                    return;
                setAppSettingsDialogIsOpen(false);
            }}
        >
            <DialogTitle variant="h4" textAlign="center">Application Settings</DialogTitle>
            <DialogContent>
                <Stack spacing={2}>
                    <DialogContentText variant="body1">These settings are stored and applied in this browser only.</DialogContentText>
                    <Divider />
                    <Option description="Application Theme">
                        <ToggleButtonGroup required value={appDarkTheme}>
                            <ToggleButton value={false} onClick={() => {
                                setAppDarkTheme(false);
                            }} >
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <LightModeIcon fontSize="medium" />
                                    <Typography>Light</Typography>
                                </Stack>
                            </ToggleButton>
                            <ToggleButton value={true} onClick={() => {
                                setAppDarkTheme(true);
                            }}>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <DarkModeIcon fontSize="medium" />
                                    <Typography>Dark</Typography>
                                </Stack>
                            </ToggleButton>
                        </ToggleButtonGroup>

                    </Option>

                </Stack>
            </DialogContent>
            <DialogActions>
                <Button color="primary" variant="contained" sx={{ width: "100%" }} onClick={() => {
                    setAppSettingsDialogIsOpen(false);
                }}>
                    <Typography variant="body1">Close</Typography>
                </Button>
            </DialogActions>
        </Dialog>
    );
};