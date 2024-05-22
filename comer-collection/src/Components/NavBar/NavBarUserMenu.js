import React, { useState } from "react";
import { Typography, Button, Divider, Menu, MenuItem, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppUser } from "../../ContextProviders/AppUser.js";
import {
    ArrowDropDownIcon,
    AccountCircleIcon,
    PhotoCameraBackIcon,
    LogoutIcon
} from "../../Imports/Icons.js";

export const NavBarUserMenu = () => {
    const [anchorElement, setAnchorElement] = useState(null);
    const [appUser, setAppUser] = useAppUser();
    const navigate = useNavigate();

    const handleMenuOpen = (event) => {
        setAnchorElement(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorElement(null);
    };

    return (
        <>
            <Button
                aria-expanded={Boolean(anchorElement)}
                aria-haspopup={Boolean(anchorElement)}
                endIcon={<ArrowDropDownIcon sx={{ height: "100%", color: "white" }} />}
                onClick={handleMenuOpen}
                sx={{ textTransform: "unset", paddingLeft: "20px", paddingRight: "10px" }}
                variant="text"
            >
                <Stack
                    alignContent="center"
                    alignItems="center"
                    direction="row"
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
                <MenuItem onClick={() => {
                    handleMenuClose();
                    navigate("/Account/Profile");
                }}
                >
                    <Stack
                        direction="row"
                        spacing={1}
                    >
                        <AccountCircleIcon />

                        <Typography variant="body">
                            My Profile
                        </Typography>
                    </Stack>
                </MenuItem>

                <MenuItem onClick={() => {
                    handleMenuClose();
                    navigate("/Account/MyExhibitions");
                }}
                >
                    <Stack
                        direction="row"
                        spacing={1}
                    >
                        <PhotoCameraBackIcon />

                        <Typography variant="body">
                            My Exhibitions
                        </Typography>
                    </Stack>
                </MenuItem>

                <Divider />

                <MenuItem onClick={() => {
                    handleMenuClose();
                    setAppUser(null);
                    localStorage.removeItem("token");
                    navigate("/");
                }}
                >
                    <Stack
                        direction="row"
                        spacing={1}
                    >
                        <LogoutIcon />

                        <Typography variant="body">
                            Sign Out
                        </Typography>
                    </Stack>
                </MenuItem>
            </Menu>
        </>
    );
};
