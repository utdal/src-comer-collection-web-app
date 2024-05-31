import { Box, Button, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import React, { useCallback } from "react";
import { useNavigate } from "react-router";
import PropTypes from "prop-types";
import SideBySideLogo from "./Logos/SideBySideLogo.js";

export const FullPageMessage = ({ message, button = true, buttonText, buttonDestination = "/SignIn", Icon, buttonAction, includeLinearProgress = false, includeLogo = false, viewportHeight = false }) => {
    const navigate = useNavigate();

    const handleNavigate = useCallback(() => {
        navigate(buttonDestination);
    }, [buttonDestination, navigate]);

    return (
        <Box
            component={Paper}
            square
            sx={{
                width: "100%",
                height: viewportHeight ? "100vh" : "100%",
                boxSizing: "border-box",
                padding: "50px"
            }}
        >
            <Stack
                alignItems="center"
                direction="column"
                justifyContent="center"
                spacing={2}
                sx={{ height: "100%" }}
            >
                {includeLogo ? <SideBySideLogo /> : null}

                {Icon
                    ? <Icon sx={{ fontSize: "150pt", opacity: 0.5 }} />
                    : null}

                <Typography variant="h4">
                    {message}
                </Typography>

                {button && (buttonDestination || buttonText)
                    ? (
                        <Button
                            onClick={buttonAction ?? handleNavigate}
                            variant="contained"
                        >
                            {buttonText ?? "Return to Login Page"}
                        </Button>
                    )
                    : null}
            </Stack>

            {includeLinearProgress ? <LinearProgress /> : null}
        </Box>
    );
};

FullPageMessage.propTypes = {
    Icon: PropTypes.elementType,
    button: PropTypes.bool,
    buttonAction: PropTypes.func,
    buttonDestination: PropTypes.string,
    buttonText: PropTypes.string,
    includeLinearProgress: PropTypes.bool,
    includeLogo: PropTypes.bool,
    message: PropTypes.string.isRequired,
    viewportHeight: PropTypes.bool
};
