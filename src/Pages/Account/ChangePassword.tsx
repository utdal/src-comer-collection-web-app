import { useNavigate, useRevalidator } from "react-router";
import React, { useCallback, useState } from "react";
import { Box, Button, Divider, Paper, Stack, TextField, Typography } from "@mui/material";
import useAppUser from "../../Hooks/useAppUser";
import { useTitle, useSnackbar } from "../../ContextProviders/AppFeatures";

import { sendAuthenticatedRequest } from "../../Helpers/APICalls";

const ChangePassword = (): React.JSX.Element => {
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

    const handleChangePassword = useCallback(async (oldPass: string, newPass: string) => {
        return sendAuthenticatedRequest("PUT", "/api/account/password", { oldPassword: oldPass, newPassword: newPass });
    }, []);

    const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitEnabled(false);
        handleChangePassword(newPassword, oldPassword).then((response) => {
            if (response.token != null) {
                localStorage.setItem("token", response.token);
                showSnackbar("Password changed", "success");
                revalidator.revalidate();
                navigate("/Account/Profile");
            } else {
                throw new Error("Password change request did not get a token in the response");
            }
        }).catch(() => {
            setOldPassword("");
            setNewPassword("");
            setNewPasswordConfirm("");
            setError(true);
            setSubmitEnabled(true);
        });
    }, [handleChangePassword, navigate, newPassword, oldPassword, revalidator, showSnackbar]);

    const handleOldPasswordInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>): void => {
        setOldPassword(event.target.value);
        setError(false);
    }, []);

    const handleNewPasswordInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>): void => {
        setNewPassword(event.target.value);
        setError(false);
    }, []);

    const handleConfirmNewPasswordInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>): void => {
        setNewPasswordConfirm(event.target.value);
        setError(false);
    }, []);

    const handleReturnToProfile = useCallback((): void => {
        navigate("/Account/Profile");
    }, [navigate]);

    return (
        <Box
            component={Paper}
            square
            sx={{ height: "100%" }}
        >
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ height: "100%" }}
            >
                <Stack
                    alignItems="center"
                    direction="column"
                    justifyContent="center"
                    spacing={2}
                    sx={{ width: "100%", height: "100%" }}
                >
                    {appUser !== null && appUser !== false && appUser.pw_change_required
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
                        onChange={handleOldPasswordInputChange}
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
                        onChange={handleNewPasswordInputChange}
                        required
                        sx={{ minWidth: "400px" }}
                        type="password"
                        value={newPassword}
                    />

                    <TextField
                        error={Boolean(error)}
                        label="Confirm New Password"
                        name="password"
                        onChange={handleConfirmNewPasswordInputChange}
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

                    {appUser != null && appUser !== false && appUser.pw_change_required
                        ? (
                            <Button
                                disabled={!submitEnabled}
                                onClick={handleReturnToProfile}
                                sx={{ minWidth: "400px" }}
                                variant="outlined"
                            >
                                Return to Profile
                            </Button>
                        )
                        : null}
                </Stack>
            </Box>
        </Box>
    );
};

export default ChangePassword;
