import React, { useCallback } from "react";
import type { ListItemButtonProps, Theme } from "@mui/material";
import { ListItemButton, ListItemIcon, styled, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useAppUser from "../../Hooks/useAppUser";
import type { AppUser, NavPaneLinkDefinition } from "../../index";

interface StyledListItemButtonProps extends ListItemButtonProps {
    isSelected: boolean;
    theme: Theme;
}

const StyledListItemButton = styled(ListItemButton, {
    shouldForwardProp: (prop) => prop !== "isSelected"
})(({ theme, isSelected }: StyledListItemButtonProps) => ({
    "&:not(:hover)": {
        backgroundColor: isSelected ? theme.palette.secondary.dark : "unset",
    },
    "&:hover": {
        backgroundColor: isSelected ? theme.palette.secondary.main : theme.palette.neutral.light,
        textDecoration: "underline"
    }
}));

const AccountNavButton = ({ linkDefinition }: {
    readonly linkDefinition: NavPaneLinkDefinition;
}): React.JSX.Element => {
    const appUser = useAppUser() as AppUser;
    const navigate = useNavigate();
    const theme = useTheme();

    const handleClick = useCallback(() => {
        navigate(linkDefinition.link);
    }, [linkDefinition.link, navigate]);

    const isSelected = location.pathname === linkDefinition.link || location.pathname.startsWith(`${linkDefinition.link}/`);

    return (
        <StyledListItemButton
            disabled={Boolean(linkDefinition.requirePermanentPassword && appUser.pw_change_required)}
            isSelected={isSelected}
            key={linkDefinition.title}
            onClick={handleClick}
            theme={theme}
        >
            <ListItemIcon sx={{ color: "white" }}>
                <linkDefinition.Icon fontSize="large" />
            </ListItemIcon>

            {linkDefinition.displayText}
        </StyledListItemButton>
    );
};

export default AccountNavButton;
