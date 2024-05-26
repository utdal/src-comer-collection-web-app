import React, { useCallback, useEffect, useState } from "react";
import {
    Typography, Stack, Paper, Box
} from "@mui/material";
import { DataTable } from "../../Components/DataTable/DataTable.js";
import { PhotoCameraBackIcon } from "../../Imports/Icons.js";
import { ExhibitionSettingsDialog } from "../../Components/Dialogs/ExhibitionSettingsDialog.js";
import { ItemSingleDeleteDialog } from "../../Components/Dialogs/ItemSingleDeleteDialog.js";
import { useTitle } from "../../ContextProviders/AppFeatures.js";
import { useAppUser } from "../../ContextProviders/AppUser.js";

import { MyExhibition } from "../../Classes/Entities/Exhibition.js";
import { ExhibitionTitleCell } from "../../Components/TableCells/Exhibition/ExhibitionTitleCell.js";
import { ExhibitionOpenInCurrentTabCell } from "../../Components/TableCells/Exhibition/ExhibitionOpenInCurrentTabCell.js";
import { ExhibitionDateCreatedCell } from "../../Components/TableCells/Exhibition/ExhibitionDateCreatedCell.js";
import { ExhibitionDateModifiedCell } from "../../Components/TableCells/Exhibition/ExhibitionDateModifiedCell.js";
import { ExhibitionAccessCell } from "../../Components/TableCells/Exhibition/ExhibitionAccessCell.js";
import { ExhibitionOptionsCell } from "../../Components/TableCells/Exhibition/ExhibitionOptionsCell.js";
import { ManagementPageProvider, useItemsReducer } from "../../ContextProviders/ManagementPageProvider.js";
import { CreateExhibitionButton } from "../../Components/Buttons/CreateExhibitionButton.js";
import { ExhibitionCreationRestriction } from "../../Components/TextBanners/ExhibitionCreationRestriction.js";
import { useDialogState } from "../../Hooks/useDialogState.js";

const exhibitionTableFields = [
    {
        columnDescription: "Title",
        maxWidth: "200px",
        TableCellComponent: ExhibitionTitleCell,
        generateSortableValue: (exhibition) => exhibition.title.toLowerCase()
    },
    {
        columnDescription: "Open",
        TableCellComponent: ExhibitionOpenInCurrentTabCell
    },
    {
        columnDescription: "Date Created",
        TableCellComponent: ExhibitionDateCreatedCell,
        generateSortableValue: (exhibition) => new Date(exhibition.date_created)
    },
    {
        columnDescription: "Date Modified",
        TableCellComponent: ExhibitionDateModifiedCell,
        generateSortableValue: (exhibition) => new Date(exhibition.date_modified)
    },
    {
        columnDescription: "Access",
        TableCellComponent: ExhibitionAccessCell
    },
    {
        columnDescription: "Options",
        TableCellComponent: ExhibitionOptionsCell
    }
];

const MyExhibitions = () => {
    useTitle("My Exhibitions");

    const [appUser, , initializeAppUser] = useAppUser();

    const [dialogIsOpen, setDialogIsOpen] = useState(false);
    const [dialogExhibitionId, setDialogExhibitionId] = useState(null);
    const [dialogExhibitionTitle, setDialogExhibitionTitle] = useState("");
    const [dialogExhibitionAccess, setDialogExhibitionAccess] = useState(null);
    const [dialogEditMode, setDialogEditMode] = useState(false);

    const [deleteDialogState, openDeleteDialog] = useDialogState(false);

    const [exhibitionsCombinedState, { setItems: setExhibitions }] = useItemsReducer(MyExhibition);

    useEffect(() => {
        setExhibitions(appUser.Exhibitions);
    }, [appUser, setExhibitions]);

    const handleOpenExhibitionCreateDialog = useCallback(() => {
        setDialogEditMode(false);
        setDialogExhibitionId(null);
        setDialogIsOpen(true);
    }, []);

    const handleOpenExhibitionSettings = useCallback((exhibition) => {
        setDialogExhibitionId(exhibition.id);
        setDialogExhibitionAccess(exhibition.privacy);
        setDialogExhibitionTitle(exhibition.title);
        setDialogEditMode(true);
        setDialogIsOpen(true);
    }, []);

    const handleOpenExhibitionDeleteDialog = useCallback((exhibition) => {
        openDeleteDialog(exhibition);
    }, [openDeleteDialog]);

    return (
        <ManagementPageProvider
            itemsCombinedState={exhibitionsCombinedState}
            managementCallbacks={{
                handleOpenExhibitionCreateDialog,
                handleOpenExhibitionSettings,
                handleOpenExhibitionDeleteDialog
            }}
            setItems={setExhibitions}
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

                <ExhibitionCreationRestriction />

                <Box sx={{ gridArea: "table" }}>
                    <DataTable
                        defaultSortAscending={false}
                        defaultSortColumn="Date Modified"
                        tableFields={exhibitionTableFields}
                    />
                </Box>

                <ItemSingleDeleteDialog
                    dialogState={deleteDialogState}
                    requireTypedConfirmation
                />

                <ExhibitionSettingsDialog
                    dialogExhibitionAccess={dialogExhibitionAccess}
                    dialogExhibitionId={dialogExhibitionId}
                    dialogExhibitionTitle={dialogExhibitionTitle}
                    dialogIsOpen={
                        dialogIsOpen
                            ? dialogEditMode || appUser.can_create_exhibition
                            : null
                    }
                    editMode={dialogEditMode}
                    refreshFunction={initializeAppUser}
                    setDialogExhibitionAccess={setDialogExhibitionAccess}
                    setDialogExhibitionId={setDialogExhibitionId}
                    setDialogExhibitionTitle={setDialogExhibitionTitle}
                    setDialogIsOpen={setDialogIsOpen}
                />

            </Box>
        </ManagementPageProvider>
    );
};

export default MyExhibitions;
