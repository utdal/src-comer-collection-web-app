import React, { useCallback, useState } from "react";
import { Navigate, useRevalidator } from "react-router";
import { Box, Button, Divider, Paper, Stack, TextField } from "@mui/material";
import { sendAuthenticatedRequest } from "../Helpers/APICalls.ts";
import { useAppUser } from "../Hooks/useAppUser.ts";
import { useTitle } from "../ContextProviders/AppFeatures.js";

const SignIn = () => {
    const appUser = useAppUser();
    const revalidator = useRevalidator();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [formEnabled, setFormEnabled] = useState(true);

    useTitle("Sign In");

    const handleSignIn = useCallback(async (event) => {
        event.preventDefault();
        setFormEnabled(false);

        try {
            const response = await sendAuthenticatedRequest("PUT", "/api/account/signin", {
                email, password
            });

            if (response.token) {
                localStorage.setItem("token", response.token);
                revalidator.revalidate();
            }
        } catch (e) {
            setPassword("");
            setFormEnabled(true);
            setError(true);
        }
    }, [email, password, revalidator]);

    return (appUser &&
        <Navigate
            replace
            to="/Account/Profile"
        />) ||
    (appUser === false &&
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
                        onChange={(event) => {
                            setEmail(event.target.value);
                            setError(false);
                        }}
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
                        onChange={(event) => {
                            setPassword(event.target.value);
                            setError(false);
                        }}
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
    );
};

export default SignIn;
