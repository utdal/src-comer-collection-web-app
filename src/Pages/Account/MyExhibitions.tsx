import React, { useEffect, useMemo } from "react";
import {
    Typography, Stack, Paper, Box
} from "@mui/material";
import DataTable from "../../Components/DataTable/DataTable.js";
import { PhotoCameraBackIcon } from "../../Imports/Icons.js";
import ExhibitionSettingsDialog from "../../Components/Dialogs/ExhibitionSettingsDialog.js";
import ItemSingleDeleteDialog from "../../Components/Dialogs/ItemSingleDeleteDialog.js";
import { useTitle } from "../../ContextProviders/AppFeatures.js";
import useAppUser from "../../Hooks/useAppUser.js";

import { ManagementPageProvider, useItemsReducer } from "../../ContextProviders/ManagementPageProvider.js";
import CreateExhibitionButton from "../../Components/Buttons/CreateExhibitionButton.js";
import { ExhibitionCreationRestriction } from "../../Components/TextBanners/ExhibitionCreationRestriction.js";
import { Exhibition, MyExhibition } from "../../Classes/Entities/Exhibition.js";
import PaginationSummary from "../../Components/PaginationSummary/PaginationSummary.js";
import type { AppUser, ExhibitionItem, Intent } from "../../index.js";
import useDialogStates from "../../Hooks/useDialogStates.js";

const MyExhibitions = (): React.JSX.Element => {
    useTitle("My Exhibitions");

    const appUser = useAppUser() as AppUser;

    const intentArray: Intent[] = ["exhibition-single-create", "exhibition-single-update-settings", "single-delete"];

    const {
        dialogStateDictionary,
        openDialogByIntentWithNoUnderlyingItems,
        openDialogByIntentWithSingleUnderlyingItem,
        openDialogByIntentWithMultipleUnderlyingItems,
        closeDialogByIntent
    } = useDialogStates(intentArray);

    const [exhibitionsCombinedState, itemsCallbacks] = useItemsReducer(appUser.Exhibitions as ExhibitionItem[]);

    const {
        setItems: setExhibitions
    } = itemsCallbacks;

    useEffect(() => {
        setExhibitions(appUser.Exhibitions as ExhibitionItem[]);
    }, [setExhibitions, appUser.Exhibitions]);

    const managementCallbacks = useMemo(() => ({
        openDialogByIntentWithNoUnderlyingItems,
        closeDialogByIntent,
        openDialogByIntentWithMultipleUnderlyingItems,
        openDialogByIntentWithSingleUnderlyingItem
    }), [closeDialogByIntent, openDialogByIntentWithMultipleUnderlyingItems, openDialogByIntentWithNoUnderlyingItems, openDialogByIntentWithSingleUnderlyingItem]);

    return (
        <ManagementPageProvider
            Entity={Exhibition}
            itemsCallbacks={itemsCallbacks}
            itemsCombinedState={exhibitionsCombinedState}
            managementCallbacks={managementCallbacks}
        >
            <Box
                component={Paper}
                square
                sx={{
                    overflowY: "auto",
                    padding: "50px",
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    gridTemplateRows: "40px 80px calc(100vh - 284px)",
                    gridTemplateAreas: `
            "header"
            "comment"
            "table"
        `
                }}
            >
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    sx={{ gridArea: "header" }}
                >
                    <Stack
                        alignItems="center"
                        direction="row"
                        spacing={2}
                    >
                        <PhotoCameraBackIcon fontSize="large" />

                        <Typography variant="h4">
                            My Exhibitions
                        </Typography>
                    </Stack>

                    <CreateExhibitionButton />

                </Stack>

                <Stack
                    direction="row"
                    justifyContent="space-between"
                >

                    <ExhibitionCreationRestriction />

                    <PaginationSummary hideOnSinglePage />
                </Stack>

                <Box sx={{ gridArea: "table" }}>
                    <DataTable
                        defaultSortAscending={false}
                        defaultSortColumn="Date Modified"
                        noSkeleton
                        rowSelectionEnabled
                        tableFields={MyExhibition.tableFields}
                    />
                </Box>

            </Box>

            <ItemSingleDeleteDialog dialogState={dialogStateDictionary["single-delete"]} />

            <ExhibitionSettingsDialog dialogState={dialogStateDictionary["exhibition-single-create"]} />

            <ExhibitionSettingsDialog dialogState={dialogStateDictionary["exhibition-single-update-settings"]} />
        </ManagementPageProvider>
    );
};

export default MyExhibitions;
