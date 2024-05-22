import { useNavigate } from "react-router";
import React, { useEffect, useState } from "react";
import { Box, Button, Divider, Paper, Stack, TextField, Typography } from "@mui/material";
import { useAppUser } from "../../ContextProviders/AppUser.js";
import { useTitle, useSnackbar } from "../../ContextProviders/AppFeatures.js";

import { sendAuthenticatedRequest } from "../../Helpers/APICalls.js";
import { useAccountNav } from "../../Hooks/useAccountNav.js";

const ChangePassword = () => {
    const [, setSelectedNavItem] = useAccountNav();

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
    const [error, setError] = useState(false);
    const [submitEnabled, setSubmitEnabled] = useState(true);

    const [appUser, , initializeAppUser] = useAppUser();

    const showSnackbar = useSnackbar();

    const navigate = useNavigate();
    useTitle("Change Password");

    // Api call here
    const handleChangePassword = async (event) => {
        event.preventDefault();
        setSubmitEnabled(false);

        try {
            const response = await sendAuthenticatedRequest("PUT", "/api/user/changepassword", { oldPassword, newPassword });

            if (response.token) {
                localStorage.setItem("token", response.token);

                await initializeAppUser();
                navigate("/Account");
                showSnackbar("Password changed", "success");
            } else {
                throw new Error("Password change request did not get a token in the response");
            }
        } catch (err) {
            setOldPassword("");
            setNewPassword("");
            setNewPasswordConfirm("");
            setError(true);
            setSubmitEnabled(true);
        }
    };

    useEffect(() => {
        setSelectedNavItem("Change Password");
    });

    return (
        <Box
            component={Paper}
            square
            sx={{ height: "100%" }}
        >
            <Box
                component="form"
                onSubmit={handleChangePassword}
                sx={{ height: "100%" }}
            >
                <Stack
                    alignItems="center"
                    direction="column"
                    justifyContent="center"
                    spacing={2}
                    sx={{ width: "100%", height: "100%" }}
                >
                    {appUser.pw_change_required
                        ? (
                            <>
                                <Typography variant="h5">
                                    Please change your password.
                                </Typography>

                                <Divider />
                            </>
                        )
                        : null}

                    <TextField
                        autoFocus
                        error={Boolean(error)}
                        label="Old Password"
                        name="password"
                        onChange={(event) => {
                            setOldPassword(event.target.value);
                            setError(false);
                        }}
                        required
                        sx={{ minWidth: "400px" }}
                        type="password"
                        value={oldPassword}
                    />

                    <Divider />

                    <TextField
                        error={Boolean(error)}
                        label="New Password"
                        name="password"
                        onChange={(event) => {
                            setNewPassword(event.target.value);
                            setError(false);
                        }}
                        required
                        sx={{ minWidth: "400px" }}
                        type="password"
                        value={newPassword}
                    />

                    <TextField
                        error={Boolean(error)}
                        label="Confirm New Password"
                        name="password"
                        onChange={(event) => {
                            setNewPasswordConfirm(event.target.value);
                            setError(false);
                        }}
                        required
                        sx={{ minWidth: "400px" }}
                        type="password"
                        value={newPasswordConfirm}
                    />

                    <Divider />

                    <Button
                        disabled={!(submitEnabled && oldPassword && newPassword && newPassword === newPasswordConfirm)}
                        sx={{ minWidth: "400px" }}
                        type="submit"
                        variant="contained"
                    >
                        <Typography variant="body1">
                            Change Password
                        </Typography>
                    </Button>

                    {!appUser.pw_change_required && (
                        <Button
                            disabled={!submitEnabled}
                            onClick={() => {
                                navigate("/Account/Profile");
                            }}
                            sx={{ minWidth: "400px" }}
                            variant="outlined"
                        >
                            <Typography variant="body1">
                                Return to Profile
                            </Typography>
                        </Button>
                    )}
                </Stack>
            </Box>
        </Box>
    );
};

export default ChangePassword;
