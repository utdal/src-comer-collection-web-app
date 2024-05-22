import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router";
import { Box, Button, Divider, Paper, Stack, TextField, Typography } from "@mui/material";
import { sendAuthenticatedRequest } from "../Helpers/APICalls.js";
import { useAppUser } from "../ContextProviders/AppUser.js";
import { useTitle } from "../ContextProviders/AppFeatures.js";

const SignIn = () => {
    const [appUser, setAppUser] = useAppUser();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [formEnabled, setFormEnabled] = useState(true);

    const navigate = useNavigate();
    const setTitleText = useTitle();

    const handleSignIn = async (event) => {
        event.preventDefault();
        setFormEnabled(false);

        try {
            const response = await sendAuthenticatedRequest("PUT", "/api/public/signin", {
                email, password
            });

            if (response.token) {
                localStorage.setItem("token", response.token);
                const profileResponse = await sendAuthenticatedRequest("GET", "/api/user/profile");
                setAppUser(profileResponse.data);
                navigate("/Account");
            }
        } catch (e) {
            setAppUser(null);
            localStorage.removeItem("token");
            setPassword("");
            setFormEnabled(true);
            setError(true);
        }
    };

    useEffect(() => {
        setTitleText("Sign In");
    });

    return (appUser &&
        <Navigate
            replace
            to="/Account"
        />) ||
    (!appUser &&
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
                        <Typography variant="body1">
                            Sign In
                        </Typography>
                    </Button>
                </Stack>
            </Box>
        </Box>
    );
};

export default SignIn;
