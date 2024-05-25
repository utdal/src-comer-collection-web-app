import { Box, Button, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router";
import PropTypes from "prop-types";

export const FullPageMessage = ({ message, buttonText, buttonDestination = null, Icon, buttonAction = null, includeLinearProgress = false }) => {
    const navigate = useNavigate();

    return (
        <Box
            component={Paper}
            square
            sx={{ width: "100%", height: "100%", boxSizing: "border-box", padding: "50px" }}
        >
            <Stack
                alignItems="center"
                direction="column"
                justifyContent="center"
                spacing={2}
                sx={{ height: "100%" }}
            >
                {Icon
                    ? <Icon sx={{ fontSize: "150pt", opacity: 0.5 }} />
                    : null}

                <Typography variant="h4">
                    {message}
                </Typography>

                {(buttonDestination || buttonText)
                    ? (
                        <Button
                            onClick={buttonAction ?? (() => navigate(buttonDestination ?? "/SignIn"))}
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
    buttonAction: PropTypes.func,
    buttonDestination: PropTypes.string,
    buttonText: PropTypes.string,
    includeLinearProgress: PropTypes.bool,
    message: PropTypes.string.isRequired
};
