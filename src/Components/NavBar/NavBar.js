import React from "react";
import { AppBar, Toolbar, Button, Divider, IconButton, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useAppUser from "../../Hooks/useAppUser.ts";
import { SettingsIcon } from "../../Imports/Icons.js";
import { AppSettingsDialog } from "../Dialogs/AppSettingsDialog/AppSettingsDialog.js";
import { NavBarUserMenu } from "./NavBarUserMenu.js";
import { NavBarButton } from "./NavBarButton.js";
import { useDialogState } from "../../Hooks/useDialogState.js";
import NavBarLogo from "./NavBarLogo.js";

const NavBar = () => {
    const appUser = useAppUser();
    const navigate = useNavigate();

    const [appSettingsDialogState, openAppSettingsDialog] = useDialogState();

    return (
        <AppBar
            color="primary"
        >
            <Stack
                alignItems="center"
                direction="row"
                height="64px"
                justifyContent="space-between"
                spacing={2}
            >
                <NavBarLogo />

                <Toolbar sx={{ height: "64px" }}>
                    <Stack
                        direction="row"
                        spacing={2}
                    >
                        <Stack
                            direction="row"
                            paddingRight={2}
                            spacing={1}
                        >
                            <NavBarButton
                                href="/BrowseCollection"
                                text="Collection"
                            />

                            <NavBarButton
                                href="/Exhibitions"
                                text="Exhibitions"
                            />
                        </Stack>

                        {appUser
                            ? (
                                <>
                                    <Divider sx={{
                                        borderWidth: "1px"
                                    }}
                                    />

                                    <NavBarUserMenu />
                                </>
                            )
                            : (
                                <Stack
                                    direction="column"
                                    sx={{
                                        justifyContent: "center"
                                    }}
                                >
                                    <Button
                                        onClick={() => { navigate("/SignIn"); }}
                                        variant="contained"
                                    >
                                        Sign In
                                    </Button>
                                </Stack>

                            )}
                    </Stack>

                    <IconButton
                        onClick={openAppSettingsDialog}
                        sx={{ color: "white", marginLeft: 2 }}
                    >
                        <SettingsIcon />
                    </IconButton>
                </Toolbar>
            </Stack>

            <AppSettingsDialog dialogState={appSettingsDialogState} />
        </AppBar>
    );
};

export default NavBar;
