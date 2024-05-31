import React, { useCallback } from "react";
import { ListItemButton, styled } from "@mui/material";
import { useLocation, useNavigate } from "react-router";
import PropTypes from "prop-types";

const StyledButton = styled(ListItemButton, {
    shouldForwardProp: (prop) => prop !== "isPageActive"
})(({ theme, isPageActive }) => ({
    height: "64px",
    minWidth: "120px",
    justifyContent: "center",
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
            {text}
        </StyledButton>
    );
};

NavBarButton.propTypes = {
    href: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
};
