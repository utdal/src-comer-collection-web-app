import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router";
import PropTypes from "prop-types";

export const FullPageMessage = ({ message, buttonText, buttonDestination, Icon, buttonAction }) => {
    const navigate = useNavigate();

    return (
        <Box component={Paper} square sx={{ width: "100%", height: "100%", boxSizing: "border-box", padding: "50px" }}>
            <Stack direction="column" alignItems="center" justifyContent="center" spacing={2} sx={{ height: "100%" }}>
                <Icon sx={{ fontSize: "150pt", opacity: 0.5 }} />
                <Typography variant="h4">{message}</Typography>
                {(buttonDestination || buttonText) && (
                    <Button variant="contained" onClick={buttonAction ?? (() => navigate(buttonDestination ?? "/SignIn"))}>
                        <Typography variant="body1">{buttonText ?? "Return to Login Page"}</Typography>
                    </Button>
                )}
            </Stack>
        </Box>
    );
};

FullPageMessage.propTypes = {
    message: PropTypes.string,
    buttonText: PropTypes.string,
    buttonDestination: PropTypes.string,
    buttonAction: PropTypes.func,
    Icon: PropTypes.oneOfType([PropTypes.func, PropTypes.object])
};
