import React, { useEffect, useState } from "react";
import {
    Typography, Stack, Paper, Box, Button, IconButton
} from "@mui/material";
import { Navigate, useNavigate } from "react-router";
import { DataTable } from "../../Components/DataTable.js";
import { PhotoCameraBackIcon, AddIcon, InfoIcon, SettingsIcon, DeleteIcon, SecurityIcon } from "../../Imports/Icons.js";
import { sendAuthenticatedRequest } from "../../Helpers/APICalls.js";
import { ExhibitionSettingsDialog } from "../../Components/Dialogs/ExhibitionSettingsDialog.js";
import { ItemSingleDeleteDialog } from "../../Components/Dialogs/ItemSingleDeleteDialog.js";
import { useSnackbar, useTitle } from "../../ContextProviders/AppFeatures.js";
import { useAppUser } from "../../ContextProviders/AppUser.js";

import { useAccountNav } from "../../ContextProviders/AccountNavProvider.js";
import { Exhibition, MyExhition } from "../../Classes/Entities/Exhibition.js";

const MyExhibitions = () => {
    const [, setSelectedNavItem] = useAccountNav();
    const showSnackbar = useSnackbar();
    const setTitleText = useTitle();

    const [appUser, , initializeAppUser] = useAppUser();

    const [dialogIsOpen, setDialogIsOpen] = useState(false);
    const [dialogExhibitionId, setDialogExhibitionId] = useState(null);
    const [dialogExhibitionTitle, setDialogExhibitionTitle] = useState("");
    const [dialogExhibitionAccess, setDialogExhibitionAccess] = useState(null);
    const [isDialogInEditMode, setDialogIsEditMode] = useState(false);

    const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false);
    const [deleteDialogExhibition, setDeleteDialogExhibition] = useState(null);

    useEffect(() => {
        setSelectedNavItem("My Exhibitions");
        setTitleText("My Exhibitions");
    }, [setSelectedNavItem, setTitleText]);

    const navigate = useNavigate();

    const handleExhibitionCreate = async (title, privacy) => {
        try {
            await sendAuthenticatedRequest("POST", "/api/user/exhibitions", { title, privacy });
            setDialogIsOpen(false);
            setDialogExhibitionId(null);
            setDialogExhibitionTitle("");
            setDialogExhibitionAccess(null);
            showSnackbar("Exhibition created", "success");
        } catch (e) {
            console.log(`Error creating exhibition: ${e.message}`);
            showSnackbar("Error creating exhibition.", "error");
        }
        initializeAppUser();
    };

    const handleExhibitionEditByOwner = async (exhibitionId, title, privacy) => {
        try {
            await sendAuthenticatedRequest("PUT", `/api/user/exhibitions/${exhibitionId}`, { title, privacy });
            setDialogIsOpen(false);
            setDialogExhibitionId(null);
            setDialogExhibitionTitle("");
            setDialogExhibitionAccess(null);
            showSnackbar("Exhibition updated", "success");
        } catch (e) {
            console.log(`Error updating exhibition: ${e.message}`);
            showSnackbar("Error updating exhibition", "error");
        }
        initializeAppUser();
    };

    const exhibitionTableFields = [
        {
            columnDescription: "Title",
            maxWidth: "200px",
            generateTableCell: (exhibition) => (
                <Typography variant="body1">{exhibition.title}</Typography>
            ),
            generateSortableValue: (exhibition) => exhibition.title.toLowerCase()
        },
        {
            columnDescription: "Open",
            columnHeaderLabel: "",
            generateTableCell: (exhibition) => (
                <Exhibition.TableCells.OpenInNewTab {...{ exhibition }} />
            )
        },
        {
            columnDescription: "Date Created",
            generateTableCell: (exhibition) => (
                <Exhibition.TableCells.DateCreated {...{ exhibition }} />
            ),
            generateSortableValue: (exhibition) => new Date(exhibition.date_created)
        },
        {
            columnDescription: "Date Modified",
            generateTableCell: (exhibition) => (
                <Exhibition.TableCells.DateModified {...{ exhibition }} />
            ),
            generateSortableValue: (exhibition) => new Date(exhibition.date_modified)
        },
        {
            columnDescription: "Access",
            generateTableCell: (exhibition) => (
                <Exhibition.TableCells.Access {...{ exhibition }} />
            )
        },
        {
            columnDescription: "Options",
            generateTableCell: (exhibition) => (
                <Stack direction="row" spacing={2}>

                    <IconButton
                        onClick={() => {
                            setDialogIsEditMode(true);
                            setDialogExhibitionId(exhibition.id);
                            setDialogExhibitionAccess(exhibition.privacy);
                            setDialogExhibitionTitle(exhibition.title);
                            setDialogIsOpen(true);
                        }}
                    >
                        <SettingsIcon />
                    </IconButton>

                    <IconButton
                        onClick={() => {
                            setDeleteDialogExhibition(exhibition);
                            setDeleteDialogIsOpen(true);
                        }}
                    >
                        <DeleteIcon />
                    </IconButton>

                </Stack>
            )
        }
    ];

    return (appUser.pw_change_required &&
        <Navigate to="/Account/ChangePassword" />
    ) || (!appUser.pw_change_required &&
        <Box component={Paper} square sx={{
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
        }}>
            <Stack direction="row" justifyContent="space-between" sx={{ gridArea: "header" }}>
                <Stack direction="row" alignItems="center" spacing={2} >
                    <PhotoCameraBackIcon fontSize="large" />
                    <Typography variant="h4">My Exhibitions</Typography>
                </Stack>
                <Button color="primary" disabled={!appUser.can_create_exhibition} variant="contained" startIcon={<AddIcon/>}
                    onClick={() => {
                        setDialogIsEditMode(false);
                        setDialogExhibitionId(null);
                        setDialogIsOpen(true);
                    }}
                >
                    <Typography variant="body1">Create Exhibition</Typography>
                </Button>
            </Stack>
            <Stack direction="column" spacing={2} sx={{ gridArea: "comment", justifyContent: "center" }}>
                {appUser.is_admin && (
                    <Stack direction="row" spacing={2} color="gray">
                        <SecurityIcon color="secondary" />
                        <Typography variant="body1">Restrictions on exhibition creation are removed for administrators.</Typography>
                    </Stack>
                )}
                {!appUser.is_admin && appUser.Courses.filter((c) => c.status === "Active").length === 0 && (
                    <Stack direction="row" spacing={2} color="gray">
                        <InfoIcon />
                        <Typography variant="body1">You must be enrolled in at least one active course to create exhibitions.</Typography>
                    </Stack>
                )}
                {!appUser.is_admin && appUser.Exhibitions.length >= appUser.exhibition_quota && (
                    <Stack direction="row" spacing={2} color="gray">
                        <InfoIcon />
                        <Typography variant="body1">Your account has reached its exhibition quota.  To create an exhibition, first delete an existing exhibition, or contact your instructor to request a quota increase.</Typography>
                    </Stack>
                )}
            </Stack>
            <Box sx={{ gridArea: "table" }}>
                <DataTable
                    items={appUser.Exhibitions}
                    visibleItems={appUser.Exhibitions}
                    defaultSortColumn={"Date Modified"}
                    defaultSortAscending={false}
                    tableFields={exhibitionTableFields}
                    NoContentIcon={InfoIcon}
                    noContentMessage="You have no exhibitions."
                    noContentButtonText="View your courses"
                    noContentButtonAction={() => {
                        navigate("/Account/Profile");
                    }}
                />
            </Box>

            <ItemSingleDeleteDialog
                deleteDialogIsOpen={deleteDialogIsOpen}
                deleteDialogItem={deleteDialogExhibition}
                Entity={MyExhition}
                requireTypedConfirmation={true}
                allItems={appUser.Exhibitions}
                setAllItems={() => {
                    initializeAppUser();
                }}
                setDeleteDialogIsOpen={setDeleteDialogIsOpen}
            />

            <ExhibitionSettingsDialog editMode={isDialogInEditMode}
                dialogIsOpen={dialogIsOpen && (isDialogInEditMode || appUser.can_create_exhibition)}
                {...{
                    dialogExhibitionId,
                    dialogExhibitionAccess,
                    setDialogExhibitionAccess,
                    dialogExhibitionTitle,
                    setDialogExhibitionTitle,
                    setDialogIsOpen,
                    handleExhibitionCreate,
                    handleExhibitionEdit: handleExhibitionEditByOwner
                }} />
        </Box>
    );
};

export default MyExhibitions;
