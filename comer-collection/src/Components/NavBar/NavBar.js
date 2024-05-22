import React, { useState } from "react";

import { AppBar, Toolbar, Typography, Button, Divider, IconButton, Stack } from "@mui/material";

import { useNavigate } from "react-router-dom";

import { useAppUser } from "../../ContextProviders/AppUser.js";
import {
    SettingsIcon
} from "../../Imports/Icons.js";
import { AppSettingsDialog } from "../Dialogs/AppSettingsDialog/AppSettingsDialog.js";
import { NavBarUserMenu } from "./NavBarUserMenu.js";
import { NavBarButton } from "./NavBarButton.js";

const NavBar = () => {
    const [appUser] = useAppUser();
    const navigate = useNavigate();

    const [appSettingsDialogIsOpen, setAppSettingsDialogIsOpen] = useState(false);

    return (
        <AppBar
            color="primary"
            position="fixed"
            sx={{ zIndex: 5000 }}
        >
            <Stack
                alignItems="center"
                direction="row"
                justifyContent="space-between"
                spacing={2}
            >
                <Stack
                    alignItems="center"
                    direction="row"
                    paddingLeft={2}
                >
                    <img
                        height="48px"
                        src="/images/logo_image_only_orange.png"
                    />

                    <Typography
                        sx={{ fontWeight: "bold", paddingLeft: 1 }}
                        variant="h5"
                    >
                        Comer Collection
                    </Typography>
                </Stack>

                <Toolbar>
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
                                        sx={{
                                            height: "60%"
                                        }}
                                        variant="contained"
                                    >
                                        <Typography>
                                            Sign In
                                        </Typography>
                                    </Button>
                                </Stack>

                            )}
                    </Stack>

                    <IconButton
                        onClick={() => {
                            setAppSettingsDialogIsOpen(true);
                        }}
                        sx={{ color: "white", marginLeft: 2 }}
                    >
                        <SettingsIcon />
                    </IconButton>
                </Toolbar>
            </Stack>

            <AppSettingsDialog
                appSettingsDialogIsOpen={appSettingsDialogIsOpen}
                setAppSettingsDialogIsOpen={setAppSettingsDialogIsOpen}
            />
        </AppBar>
    );
};

export default NavBar;
