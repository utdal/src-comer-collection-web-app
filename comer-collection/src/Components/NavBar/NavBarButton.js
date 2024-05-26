import React, { useCallback } from "react";
import { Button, Typography, styled } from "@mui/material";
import { useLocation, useNavigate } from "react-router";
import PropTypes from "prop-types";

const StyledButton = styled(Button, {
    shouldForwardProp: (prop) => prop !== "isPageActive"
})(({ theme, isPageActive }) => ({
    height: "64px",
    minWidth: "120px",
    borderBottom: isPageActive ? `5px solid ${theme.palette.secondary.main}` : "5px solid rgba(0, 0, 0, 0)",
    textTransform: "unset"
}));

export const NavBarButton = ({ href, text }) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const handleClick = useCallback(() => {
        navigate(href);
    }, [href, navigate]);

    return (
        <StyledButton
            color="secondary"
            isPageActive={pathname === href}
            onClick={handleClick}
            spacing={1}
        >
            <Typography
                color="white"
                variant="h6"
            >
                {text}
            </Typography>
        </StyledButton>
    );
};

NavBarButton.propTypes = {
    href: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
};
