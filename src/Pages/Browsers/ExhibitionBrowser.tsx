import { Box, Paper, Stack, Typography } from "@mui/material";
import React from "react";
import DataTable from "../../Components/DataTable/DataTable.js";
import { PhotoCameraBackIcon } from "../../Imports/Icons.js";
import { useTitle } from "../../ContextProviders/AppFeatures.js";
import { ManagementPageProvider, useItemsReducer } from "../../ContextProviders/ManagementPageProvider.js";
import { useLoaderData } from "react-router";
import { PublicExhibition } from "../../Classes/Entities/Exhibition.js";
import type { ExhibitionItem } from "../../index.js";
import useDialogStates from "../../Hooks/useDialogStates.js";

const ExhibitionBrowser = (): React.JSX.Element => {
    const exhibitions = useLoaderData() as ExhibitionItem[];
    const [exhibitionsCombinedState, itemsCallbacks] = useItemsReducer(exhibitions);

    useTitle("Public Exhibitions");

    const dialogCallbacks = useDialogStates([]);

    return (
        <ManagementPageProvider
            Entity={PublicExhibition}
            itemsCallbacks={itemsCallbacks}
            itemsCombinedState={exhibitionsCombinedState}
            managementCallbacks={dialogCallbacks}
        >
            <Box
                component={Paper}
                justifyItems="center"
                square
                sx={{
                    height: "calc(100vh - 64px)",
                    width: "100vw",
                    boxSizing: "border-box"
                }}
            >
                <Stack
                    spacing={4}
                    sx={{
                        paddingLeft: "200px",
                        paddingRight: "200px",
                        paddingTop: "50px"
                    }}
                >
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        paddingLeft={1}
                        spacing={2}
                    >
                        <Stack
                            alignItems="center"
                            direction="row"
                            paddingLeft={1}
                            spacing={2}
                        >
                            <PhotoCameraBackIcon fontSize="large" />

                            <Typography variant="h4">
                                Public Exhibitions
                            </Typography>
                        </Stack>
                    </Stack>

                    <Box sx={{ height: "calc(80vh - 64px)" }}>
                        <DataTable
                            defaultSortAscending={false}
                            defaultSortColumn="Last Updated"
                            rowSelectionEnabled={false}
                            tableFields={PublicExhibition.tableFields}
                        />
                    </Box>
                </Stack>
            </Box>

        </ManagementPageProvider>

    );
};

export default ExhibitionBrowser;
