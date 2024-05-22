import React, { useEffect } from "react";
import { Stack, Typography, Box } from "@mui/material";
import { InfoIcon, SearchIcon } from "../../../Imports/Icons.js";
import PropTypes from "prop-types";
import { useItemsReducer } from "../../../ContextProviders/ManagementPageProvider.js";
import { AssociationManagementPageProvider } from "../../../ContextProviders/AssociationManagementPageProvider.js";
import { Association } from "../../../Classes/Association.js";
import { entityPropTypeShape } from "../../../Classes/Entity.js";

export const AssociationTableDisplay = ({ secondaryItems, secondaryItemsResults, tableCaption, primaryItems, AssociationType, children }) => {
    const [secondaryItemsCombinedState, setSecondaryItems] = useItemsReducer();

    useEffect(() => {
        setSecondaryItems(secondaryItems);
    }, [setSecondaryItems, secondaryItems]);

    return (
        <AssociationManagementPageProvider
            AssociationType={AssociationType}
            relevantPrimaryItems={primaryItems}
            secondaryItemsCombinedState={secondaryItemsCombinedState}
            setSecondaryItems={setSecondaryItems}
        >
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
                    {(secondaryItemsCombinedState.items.length > 0 && secondaryItemsResults.length > 0 &&
                        children) ||
                        (secondaryItemsCombinedState.items.length > 0 && secondaryItemsResults.length === 0 &&
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
                        ) || (secondaryItemsCombinedState.items.length === 0 &&
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

        </AssociationManagementPageProvider>
    );
};
AssociationTableDisplay.propTypes = {
    AssociationType: Association.isRequired,
    children: PropTypes.arrayOf(PropTypes.element).isRequired,
    primaryItems: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number
    })).isRequired,
    secondaryItems: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number
    })).isRequired,
    secondaryItemsResults: PropTypes.arrayOf(entityPropTypeShape).isRequired,
    tableCaption: PropTypes.string
};
AssociationTableDisplay.defaultProps = {
    tableCaption: ""
};
