import React, { useCallback } from "react";
import type { ListItemButtonOwnProps, Theme } from "@mui/material";
import { ListItemButton, styled, useTheme } from "@mui/material";
import { useLocation, useNavigate } from "react-router";

interface StyledButtonProps extends ListItemButtonOwnProps {
    isPageActive: boolean;
    theme: Theme;
}

const StyledButton = styled(ListItemButton, {
    shouldForwardProp: (prop) => prop !== "isPageActive"
})(({ theme, isPageActive }: StyledButtonProps) => ({
    height: "64px",
    minWidth: "120px",
    justifyContent: "center",
    borderBottom: isPageActive ? `5px solid ${theme.palette.secondary.main}` : "5px solid rgba(0, 0, 0, 0)",
    textTransform: "unset"
}));

const NavBarButton = ({ href, text }: {
    readonly href: string;
    readonly text: string;
}): React.JSX.Element => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const theme = useTheme();

    const handleClick = useCallback(() => {
        navigate(href);
    }, [href, navigate]);

    return (
        <StyledButton
            color="secondary"
            isPageActive={pathname === href}
            onClick={handleClick}
            theme={theme}
        >
            {text}
        </StyledButton>
    );
};

export default NavBarButton;
