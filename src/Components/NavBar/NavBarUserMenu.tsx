import React, { useCallback, useState } from "react";
import { Typography, Button, Divider, Menu, MenuItem, Stack } from "@mui/material";
import { useNavigate, useRevalidator } from "react-router-dom";
import useAppUser from "../../Hooks/useAppUser";
import {
    ArrowDropDownIcon,
    AccountCircleIcon,
    PhotoCameraBackIcon,
    LogoutIcon
} from "../../Imports/Icons";
import type { AppUser } from "../../index";

const NavBarUserMenu = (): React.JSX.Element => {
    const [anchorElement, setAnchorElement] = useState((null as unknown) as Element | null);
    const appUser = useAppUser() as AppUser;
    const navigate = useNavigate();

    const revalidator = useRevalidator();

    const handleMenuOpen = useCallback((event: React.MouseEvent<HTMLButtonElement>): void => {
        setAnchorElement(event.currentTarget);
    }, []);

    const handleMenuClose = useCallback(() => {
        setAnchorElement(null);
    }, []);

    return (
        <>
            <Button
                aria-expanded={Boolean(anchorElement)}
                aria-haspopup={Boolean(anchorElement)}
                endIcon={<ArrowDropDownIcon sx={{ height: "100%", color: "white" }} />}
                onClick={handleMenuOpen}
                sx={{ height: "64px", textTransform: "unset", paddingLeft: "20px", paddingRight: "10px" }}
                variant="text"
            >
                <Stack
                    alignContent="center"
                    alignItems="center"
                    direction="row"
                    height="64px"
                >
                    <Typography
                        sx={{ color: "white" }}
                        variant="h6"
                    >
                        {appUser.safe_display_name}
                    </Typography>
                </Stack>
            </Button>

            <Menu
                MenuListProps={{}}
                anchorEl={anchorElement}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
                onClose={handleMenuClose}
                open={Boolean(anchorElement)}
                sx={{ zIndex: 5000 }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right"
                }}
            >
                <MenuItem onClick={(): void => {
                    handleMenuClose();
                    navigate("/Account/Profile");
                }}
                >
                    <Stack
                        direction="row"
                        spacing={1}
                    >
                        <AccountCircleIcon />

                        <Typography>
                            My Profile
                        </Typography>
                    </Stack>
                </MenuItem>

                <MenuItem onClick={(): void => {
                    handleMenuClose();
                    navigate("/Account/MyExhibitions");
                }}
                >
                    <Stack
                        direction="row"
                        spacing={1}
                    >
                        <PhotoCameraBackIcon />

                        <Typography>
                            My Exhibitions
                        </Typography>
                    </Stack>
                </MenuItem>

                <Divider />

                <MenuItem onClick={(): void => {
                    handleMenuClose();
                    localStorage.removeItem("token");
                    revalidator.revalidate();
                    navigate("/");
                }}
                >
                    <Stack
                        direction="row"
                        spacing={1}
                    >
                        <LogoutIcon />

                        <Typography>
                            Sign Out
                        </Typography>
                    </Stack>
                </MenuItem>
            </Menu>
        </>
    );
};

export default NavBarUserMenu;
