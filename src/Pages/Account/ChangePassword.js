import { useNavigate, useRevalidator } from "react-router";
import React, { useState } from "react";
import { Box, Button, Divider, Paper, Stack, TextField, Typography } from "@mui/material";
import { useAppUser } from "../../Hooks/useAppUser.ts";
import { useTitle, useSnackbar } from "../../ContextProviders/AppFeatures.tsx";

import { sendAuthenticatedRequest } from "../../Helpers/APICalls.js";

const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
    const [error, setError] = useState(false);
    const [submitEnabled, setSubmitEnabled] = useState(true);

    const appUser = useAppUser();

    const revalidator = useRevalidator();

    const showSnackbar = useSnackbar();

    const navigate = useNavigate();
    useTitle("Change Password");

    // Api call here
    const handleChangePassword = async (event) => {
        event.preventDefault();
        setSubmitEnabled(false);

        try {
            const response = await sendAuthenticatedRequest("PUT", "/api/account/password", { oldPassword, newPassword });

            if (response.token) {
                localStorage.setItem("token", response.token);
                showSnackbar("Password changed", "success");
                revalidator.revalidate();
                navigate("/Account/Profile");
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
                        Change Password
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
                            Return to Profile
                        </Button>
                    )}
                </Stack>
            </Box>
        </Box>
    );
};

export default ChangePassword;
