import React from "react";
import { useTheme } from "@emotion/react";
import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import PropTypes from "prop-types";

export const NavBarButton = ({ href, text }) => {
    const navigate = useNavigate();
    const theme = useTheme();

    const isPageActive = document.location.pathname === href;

    return (
        <Button
            color="secondary"
            onClick={() => navigate(href)}
            spacing={1}
            sx={{
                height: "64px",
                minWidth: "120px",
                borderBottom: isPageActive ? `5px solid ${theme.palette.secondary.main}` : "5px solid rgba(0, 0, 0, 0)",
                textTransform: "unset"
            }}
        >
            <Typography
                color="white"
                variant="h6"
            >
                {text}
            </Typography>
        </Button>
    );
};

NavBarButton.propTypes = {
    href: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
};
