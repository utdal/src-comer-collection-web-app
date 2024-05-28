import { Box, Paper, Stack, Typography } from "@mui/material";
import React, { useCallback } from "react";
import { DataTable } from "../../Components/DataTable/DataTable.js";
import { PhotoCameraBackIcon } from "../../Imports/Icons.js";
import { useTitle } from "../../ContextProviders/AppFeatures.js";
import { ExhibitionTitleCell } from "../../Components/TableCells/Exhibition/ExhibitionTitleCell.js";
import { ExhibitionCuratorCell } from "../../Components/TableCells/Exhibition/ExhibitionCuratorCell.js";
import { ExhibitionDateModifiedCell } from "../../Components/TableCells/Exhibition/ExhibitionDateModifiedCell.js";
import { ExhibitionOpenInCurrentTabCell } from "../../Components/TableCells/Exhibition/ExhibitionOpenInCurrentTabCell.js";
import { ManagementPageProvider, useItemsReducer } from "../../ContextProviders/ManagementPageProvider.js";
import { useLoaderData } from "react-router";
import { PublicExhibition } from "../../Classes/Entities/Exhibition.js";

const exhibitionTableFields = [
    {
        columnDescription: "Title",
        maxWidth: "200px",
        TableCellComponent: ExhibitionTitleCell,
        generateSortableValue: (exhibition) => exhibition.title?.toLowerCase()
    },
    {
        columnDescription: "Curator",
        TableCellComponent: ExhibitionCuratorCell,
        generateSortableValue: (exhibition) => exhibition.curator?.toLowerCase()
    },
    {
        columnDescription: "Last Updated",
        TableCellComponent: ExhibitionDateModifiedCell,
        generateSortableValue: (exhibition) => new Date(exhibition.date_modified)
    },
    {
        columnDescription: "Open",
        columnHeaderLabel: "",
        TableCellComponent: ExhibitionOpenInCurrentTabCell
    }
];

export const ExhibitionBrowser = () => {
    const exhibitions = useLoaderData();
    const [exhibitionsCombinedState, itemsCallbacks] = useItemsReducer(exhibitions);

    useTitle("Public Exhibitions");

    const handleRefresh = useCallback(async () => {}, []);

    return (
        <ManagementPageProvider
            Entity={PublicExhibition}
            handleRefresh={handleRefresh}
            itemsCallbacks={itemsCallbacks}
            itemsCombinedState={exhibitionsCombinedState}
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
                            emptyMinHeight="500px"
                            nonEmptyHeight="500px"
                            tableFields={exhibitionTableFields}
                        />
                    </Box>
                </Stack>
            </Box>

        </ManagementPageProvider>

    );
};
