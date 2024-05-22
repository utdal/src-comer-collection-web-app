import React from "react";
import { Stack, Typography, Box } from "@mui/material";
import { InfoIcon, SearchIcon } from "../../../Imports/Icons.js";
import PropTypes from "prop-types";
import { useSecondaryItems, useVisibleSecondaryItems } from "../../../ContextProviders/AssociationManagementPageProvider.js";

export const AssociationTableDisplay = ({ tableCaption = "", children }) => {
    const [secondaryItems] = useSecondaryItems();
    const [visibleSecondaryItems] = useVisibleSecondaryItems();

    return (
        <Box sx={{
            display: "grid",
            gridTemplateAreas: `
                "caption"
                "table"
            `,
            gridTemplateRows: tableCaption ? "50px 300px" : "0px 300px"
        }}
        >
            <Stack
                direction="row"
                justifyContent="center"
                sx={{ gridArea: "caption" }}
            >
                {tableCaption
                    ? (
                        <Typography
                            align="center"
                            variant="h5"
                        >
                            {tableCaption}
                        </Typography>
                    )
                    : null}
            </Stack>

            <Box sx={{ gridArea: "table", height: "100%", overflowY: "auto" }}>
                {(secondaryItems.length > 0 && visibleSecondaryItems.length > 0 &&
                        children) ||
                        (secondaryItems.length > 0 && visibleSecondaryItems.length === 0 &&
                            <Box sx={{ width: "100%" }}>
                                <Stack
                                    alignItems="center"
                                    direction="column"
                                    justifyContent="center"
                                    paddingTop={2}
                                    spacing={2}
                                    sx={{ height: "100%", opacity: 0.5 }}
                                >
                                    <SearchIcon sx={{ fontSize: "150pt" }} />

                                    <Typography variant="h4">
                                        No results
                                    </Typography>
                                </Stack>
                            </Box>
                        ) || (secondaryItems.length === 0 &&
                            <Box sx={{ width: "100%" }}>
                                <Stack
                                    alignItems="center"
                                    direction="column"
                                    justifyContent="center"
                                    paddingTop={2}
                                    spacing={2}
                                    sx={{ height: "100%", opacity: 0.5 }}
                                >
                                    <InfoIcon sx={{ fontSize: "150pt" }} />

                                    <Typography variant="h4">
                                        This list is empty
                                    </Typography>
                                </Stack>
                            </Box>
                )}
            </Box>
        </Box>
    );
};

AssociationTableDisplay.propTypes = {
    children: PropTypes.node.isRequired,
    tableCaption: PropTypes.string.isRequired
};
