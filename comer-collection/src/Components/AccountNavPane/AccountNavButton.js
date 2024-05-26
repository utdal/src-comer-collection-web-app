import React from "react";
import { ListItemButton, ListItemIcon, ListItemText, Typography, styled } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppUser } from "../../ContextProviders/AppUser.js";
import PropTypes from "prop-types";

export const accountLlinkDefinitionPropTypeShape = PropTypes.shape({
    requirePermanentPassword: PropTypes.bool,
    title: PropTypes.string,
    link: PropTypes.string,
    displayText: PropTypes.string
});

const StyledListItemButton = styled(ListItemButton, {
    shouldForwardProp: (prop) => prop !== "linkDefinition"
})(({ theme, linkDefinition }) => ({
    backgroundColor: location.pathname === linkDefinition.link ? theme.palette.secondary.main : "unset",
    "&:hover": {
        backgroundColor: location.pathname === linkDefinition.link ? theme.palette.secondary.main : theme.palette.grey.main,
        textDecoration: "underline"
    }
}));

export const AccountNavButton = ({ linkDefinition }) => {
    const [appUser] = useAppUser();
    const navigate = useNavigate();
    return (
        <StyledListItemButton
            disabled={Boolean(linkDefinition.requirePermanentPassword && appUser?.pw_change_required)}
            key={linkDefinition.title}
            linkDefinition={linkDefinition}
            onClick={() => {
                navigate(linkDefinition.link);
            }}
        >
            <ListItemIcon sx={{ color: "white" }}>
                <linkDefinition.Icon fontSize="large" />
            </ListItemIcon>

            <ListItemText
                primary={(
                    <Typography variant="body1">
                        {linkDefinition.displayText ?? linkDefinition.title}
                    </Typography>
                )}
            />
        </StyledListItemButton>
    );
};

AccountNavButton.propTypes = {
    linkDefinition: accountLlinkDefinitionPropTypeShape
};
