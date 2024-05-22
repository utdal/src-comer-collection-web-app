import React, { useEffect, useState } from "react";
import {
    Typography, Stack, Paper, Box, Button, IconButton
} from "@mui/material";
import { Navigate, useNavigate } from "react-router";
import { DataTable } from "../../Components/DataTable/DataTable.js";
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
    const [dialogEditMode, setDialogEditMode] = useState(false);

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
                <Typography variant="body1">
                    {exhibition.title}
                </Typography>
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
                <Stack
                    direction="row"
                    spacing={2}
                >

                    <IconButton
                        onClick={() => {
                            setDialogEditMode(true);
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

                <Button
                    color="primary"
                    disabled={!appUser.can_create_exhibition}
                    onClick={() => {
                        setDialogEditMode(false);
                        setDialogExhibitionId(null);
                        setDialogIsOpen(true);
                    }}
                    startIcon={<AddIcon />}
                    variant="contained"
                >
                    <Typography variant="body1">
                        Create Exhibition
                    </Typography>
                </Button>
            </Stack>

            <Stack
                direction="column"
                spacing={2}
                sx={{ gridArea: "comment", justifyContent: "center" }}
            >
                {appUser.is_admin
                    ? (
                        <Stack
                            color="gray"
                            direction="row"
                            spacing={2}
                        >
                            <SecurityIcon color="secondary" />

                            <Typography variant="body1">
                                Restrictions on exhibition creation are removed for administrators.
                            </Typography>
                        </Stack>
                    )
                    : null}

                {!appUser.is_admin && appUser.Courses.filter((c) => c.status === "Active").length === 0 && (
                    <Stack
                        color="gray"
                        direction="row"
                        spacing={2}
                    >
                        <InfoIcon />

                        <Typography variant="body1">
                            You must be enrolled in at least one active course to create exhibitions.
                        </Typography>
                    </Stack>
                )}

                {!appUser.is_admin && appUser.Exhibitions.length >= appUser.exhibition_quota && (
                    <Stack
                        color="gray"
                        direction="row"
                        spacing={2}
                    >
                        <InfoIcon />

                        <Typography variant="body1">
                            Your account has reached its exhibition quota.  To create an exhibition, first delete an existing exhibition, or contact your instructor to request a quota increase.
                        </Typography>
                    </Stack>
                )}
            </Stack>

            <Box sx={{ gridArea: "table" }}>
                <DataTable
                    NoContentIcon={InfoIcon}
                    defaultSortAscending={false}
                    defaultSortColumn="Date Modified"
                    items={appUser.Exhibitions}
                    noContentButtonAction={() => {
                        navigate("/Account/Profile");
                    }}
                    noContentButtonText="View your courses"
                    noContentMessage="You have no exhibitions."
                    tableFields={exhibitionTableFields}
                    visibleItems={appUser.Exhibitions}
                />
            </Box>

            <ItemSingleDeleteDialog
                Entity={MyExhition}
                allItems={appUser.Exhibitions}
                deleteDialogIsOpen={deleteDialogIsOpen}
                deleteDialogItem={deleteDialogExhibition}
                requireTypedConfirmation
                setAllItems={() => {
                    initializeAppUser();
                }}
                setDeleteDialogIsOpen={setDeleteDialogIsOpen}
            />

            <ExhibitionSettingsDialog
                dialogExhibitionAccess={dialogExhibitionAccess}
                dialogExhibitionId={dialogExhibitionId}
                dialogExhibitionTitle={dialogExhibitionTitle}
                dialogIsOpen={dialogIsOpen ? dialogEditMode || appUser.can_create_exhibition : null}
                editMode={dialogEditMode}
                handleExhibitionCreate={handleExhibitionCreate}
                handleExhibitionEdit={handleExhibitionEditByOwner}
                setDialogExhibitionAccess={setDialogExhibitionAccess}
                setDialogExhibitionTitle={setDialogExhibitionTitle}
                setDialogIsOpen={setDialogIsOpen}
            />
        </Box>
    );
};

export default MyExhibitions;
