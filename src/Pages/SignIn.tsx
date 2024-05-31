import React, { useCallback, useState } from "react";
import { Navigate, useRevalidator } from "react-router";
import { Box, Button, Divider, Paper, Stack, TextField } from "@mui/material";
import type { APIResponse } from "../Helpers/APICalls";
import { sendAuthenticatedRequest } from "../Helpers/APICalls";
import { useAppUser } from "../Hooks/useAppUser";
import { useSnackbar, useTitle } from "../ContextProviders/AppFeatures.tsx";

const SignIn = (): React.JSX.Element => {
    const appUser = useAppUser();
    const revalidator = useRevalidator();

    const showSnackbar = useSnackbar();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [formEnabled, setFormEnabled] = useState(true);

    useTitle("Sign In");

    const handleSignIn = useCallback((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFormEnabled(false);

        sendAuthenticatedRequest("PUT", "/api/account/signin", {
            email, password
        }).then((response: APIResponse) => {
            const token = response.token;

            if (token != null) {
                localStorage.setItem("token", token);
                revalidator.revalidate();
            }
        }).catch((e) => {
            setPassword("");
            setFormEnabled(true);
            setError(true);
            showSnackbar((e as Error).message, "error");
        });
    }, [email, password, revalidator, showSnackbar]);

    const handleEmailInput = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
        setError(false);
    }, []);

    const handlePasswordInput = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
        setError(false);
    }, []);

    return (appUser != null && appUser !== false
        ? (
            <Navigate
                replace
                to="/Account/Profile"
            />
        )
        : (
            <Box
                component={Paper}
                square
                sx={{ height: "100%" }}
            >
                <Box
                    component="form"
                    onSubmit={handleSignIn}
                    sx={{ height: "100%" }}
                >
                    <Stack
                        alignItems="center"
                        direction="column"
                        justifyContent="center"
                        spacing={2}
                        sx={{ width: "100%", height: "100%" }}
                    >
                        <TextField
                            autoFocus
                            disabled={!formEnabled}
                            error={Boolean(error)}
                            label="Email"
                            name="email"
                            onChange={handleEmailInput}
                            required
                            sx={{ minWidth: "400px" }}
                            type="text"
                            value={email}
                        />

                        <TextField
                            disabled={!formEnabled}
                            error={Boolean(error)}
                            label="Password"
                            name="password"
                            onChange={handlePasswordInput}
                            required
                            sx={{ minWidth: "400px" }}
                            type="password"
                            value={password}
                        />

                        <Divider />

                        <Button
                            disabled={!(email && password && formEnabled)}
                            sx={{ minWidth: "400px" }}
                            type="submit"
                            variant="contained"
                        >
                            Sign In
                        </Button>
                    </Stack>
                </Box>
            </Box>
        )
    );
};

export default SignIn;
