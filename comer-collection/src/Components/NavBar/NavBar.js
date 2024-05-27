import React from "react";
import { AppBar, Toolbar, Typography, Button, Divider, IconButton, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppUser } from "../../Hooks/useAppUser.js";
import { SettingsIcon } from "../../Imports/Icons.js";
import { AppSettingsDialog } from "../Dialogs/AppSettingsDialog/AppSettingsDialog.js";
import { NavBarUserMenu } from "./NavBarUserMenu.js";
import { NavBarButton } from "./NavBarButton.js";
import { useDialogState } from "../../Hooks/useDialogState.js";

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
                <Stack
                    alignItems="center"
                    direction="row"
                    height="64px"
                    paddingLeft={2}
                    spacing={1}
                >
                    <img
                        height="48px"
                        src="/images/logo_image_only_orange.png"
                    />

                    <Typography
                        sx={{ fontWeight: "bold" }}
                        variant="h5"
                    >
                        Comer Collection
                    </Typography>
                </Stack>

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
