import React, { useCallback } from "react";
import { ListItemButton, ListItemIcon, styled } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppUser } from "../../Hooks/useAppUser.js";
import PropTypes from "prop-types";

export const accountLlinkDefinitionPropTypeShape = PropTypes.shape({
    requirePermanentPassword: PropTypes.bool,
    title: PropTypes.string,
    link: PropTypes.string,
    displayText: PropTypes.string
});

const StyledListItemButton = styled(ListItemButton, {
    shouldForwardProp: (prop) => prop !== "isSelected"
})(({ theme, isSelected }) => ({
    backgroundColor: isSelected ? theme.palette.secondary.main : "unset",
    "&:hover": {
        backgroundColor: isSelected ? theme.palette.secondary.main : theme.palette.grey.main,
        textDecoration: "underline"
    }
}));

export const AccountNavButton = ({ linkDefinition }) => {
    const appUser = useAppUser();
    const navigate = useNavigate();

    const handleClick = useCallback(() => {
        navigate(linkDefinition.link);
    }, [linkDefinition.link, navigate]);

    const isSelected = location.pathname === linkDefinition.link || location.pathname.startsWith(`${linkDefinition.link}/`);

    return (
        <StyledListItemButton
            disabled={Boolean(linkDefinition.requirePermanentPassword && appUser?.pw_change_required)}
            isSelected={isSelected}
            key={linkDefinition.title}
            onClick={handleClick}
        >
            <ListItemIcon sx={{ color: "white" }}>
                <linkDefinition.Icon fontSize="large" />
            </ListItemIcon>

            {linkDefinition.displayText ?? linkDefinition.title}
        </StyledListItemButton>
    );
};

AccountNavButton.propTypes = {
    linkDefinition: accountLlinkDefinitionPropTypeShape
};
