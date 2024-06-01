import React from "react";
import { List, Typography } from "@mui/material";
import type { NavPaneLinkDefinition } from "../../index.js";
import AccountNavButton from "./AccountNavButton.js";

const AccountNavSection = ({ sectionTitle, linkDefinitions }: {
    readonly sectionTitle: string;
    readonly linkDefinitions: NavPaneLinkDefinition[];
}): React.JSX.Element => {
    return (
        <>
            <Typography
                alignSelf="center"
                color="gray"
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

export default AccountNavSection;
