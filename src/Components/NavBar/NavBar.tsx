import React, { useCallback } from "react";
import { AppBar, Toolbar, Button, Divider, IconButton, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useAppUser from "../../Hooks/useAppUser";
import { SettingsIcon } from "../../Imports/Icons";
import AppSettingsDialog from "../Dialogs/AppSettingsDialog/AppSettingsDialog";
import NavBarUserMenu from "./NavBarUserMenu";
import NavBarButton from "./NavBarButton";
import NavBarLogo from "./NavBarLogo";
import useDialogStates from "../../Hooks/useDialogStates";

const NavBar = (): React.JSX.Element => {
    const appUser = useAppUser();
    const navigate = useNavigate();

    const { dialogStateDictionary, openDialogByIntentWithNoUnderlyingItems } = useDialogStates(["app-settings"]);

    const handleOpenSettingsDialog: React.MouseEventHandler<HTMLButtonElement> = useCallback(() => {
        openDialogByIntentWithNoUnderlyingItems("app-settings");
    }, [openDialogByIntentWithNoUnderlyingItems]);

    return (
        <AppBar
            color="primary"
            sx={{ gridArea: "header" }}
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

                        {appUser !== false && appUser != null
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
                                        onClick={(): void => {
                                            navigate("/SignIn");
                                        }}
                                        variant="contained"
                                    >
                                        Sign In
                                    </Button>
                                </Stack>

                            )}
                    </Stack>

                    <IconButton
                        onClick={handleOpenSettingsDialog}
                        sx={{ color: "white", marginLeft: 2 }}
                    >
                        <SettingsIcon />
                    </IconButton>
                </Toolbar>
            </Stack>

            <AppSettingsDialog dialogState={dialogStateDictionary["app-settings"]} />
        </AppBar>
    );
};

export default NavBar;
