import React from "react";
import { List, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { AccountNavButton, accountLlinkDefinitionPropTypeShape } from "./AccountNavButton.js";

export const AccountNavSection = ({ sectionTitle, linkDefinitions }) => {
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
                {linkDefinitions.map((linkDefinition) => (
                    <AccountNavButton
                        key={linkDefinition.link}
                        linkDefinition={linkDefinition}
                    />
                ))}
            </List>
        </>
    );
};

AccountNavSection.propTypes = {
    linkDefinitions: PropTypes.arrayOf(accountLlinkDefinitionPropTypeShape).isRequired,
    sectionTitle: PropTypes.string.isRequired
};
