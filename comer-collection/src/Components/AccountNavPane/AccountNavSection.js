import React from "react";
import { List, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@emotion/react";
import { useAppUser } from "../../ContextProviders/AppUser.js";
import { useAccountNav } from "../../ContextProviders/AccountNavProvider.js";
import PropTypes from "prop-types";
import { navLinkDefinitionShape } from "./AccountNavPane.js";

export const AccountNavSection = ({ sectionTitle, linkDefinitions }) => {
    const [selectedNavItem, setSelectedNavItem] = useAccountNav();

    const navigate = useNavigate();
    const [appUser] = useAppUser();
    const theme = useTheme();
    return (
        <>
            <Typography
                alignSelf="center"
                paddingTop="10px"
                variant="h5"
            >
                {sectionTitle}
            </Typography>

            <List>
                {linkDefinitions.map((item) => (
                    <ListItemButton
                        disabled={Boolean(item.requirePermanentPassword && appUser.pw_change_required)}
                        key={item.title}
                        onClick={() => {
                            setSelectedNavItem(item.title);
                            navigate(item.link);
                        }}
                        sx={{
                            backgroundColor: selectedNavItem === item.title ? theme.palette.secondary.main : "unset",
                            "&:hover": {
                                backgroundColor: selectedNavItem === item.title ? theme.palette.secondary.main : theme.palette.grey.main,
                                textDecoration: "underline"
                            }
                        }}
                    >
                        <ListItemIcon sx={{ color: "white" }}>
                            <item.Icon fontSize="large" />
                        </ListItemIcon>

                        <ListItemText
                            primary={
                                <Typography variant="body1">
                                    {item.displayText ?? item.title}
                                </Typography>
                            }
                        />
                    </ListItemButton>
                ))}
            </List>
        </>
    );
};
AccountNavSection.propTypes = {
    linkDefinitions: PropTypes.arrayOf(PropTypes.shape(navLinkDefinitionShape)).isRequired,
    sectionTitle: PropTypes.string.isRequired
};
