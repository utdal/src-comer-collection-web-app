import React from "react";
import { List, Typography, styled } from "@mui/material";
import PropTypes from "prop-types";
import { AccountNavButton, accountLlinkDefinitionPropTypeShape } from "./AccountNavButton.js";

const ColoredText = styled(Typography)(({ theme }) => ({
    color: theme.palette.grey.main
}));

/**
 * @param {{sectionTitle: string, linkDefinitions: AccountNavPaneLinkDefinition[]}} props
 * @returns {React.JSX.Element}
 */
export const AccountNavSection = ({ sectionTitle, linkDefinitions }) => {
    return (
        <>
            <ColoredText
                alignSelf="center"
                paddingTop="10px"
                variant="h5"
            >
                {sectionTitle}
            </ColoredText>

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
