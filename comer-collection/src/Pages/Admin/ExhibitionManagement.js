import React, { useCallback, useEffect, useState } from "react";
import {
    Stack,
    Button,
    Typography, Box, Paper
} from "@mui/material";
import { FullPageMessage } from "../../Components/FullPageMessage.js";
import SearchBox from "../../Components/SearchBox.js";
import { LockIcon, RefreshIcon, SearchIcon, InfoIcon, FilterAltOffOutlinedIcon, WarningIcon, AccessTimeIcon } from "../../Imports/Icons.js";
import { ItemSingleDeleteDialog } from "../../Components/Dialogs/ItemSingleDeleteDialog.js";
import { DataTable } from "../../Components/DataTable/DataTable.js";
import { Navigate } from "react-router";
import { SelectionSummary } from "../../Components/SelectionSummary.js";
import { sendAuthenticatedRequest } from "../../Helpers/APICalls.js";
import { ExhibitionSettingsDialog } from "../../Components/Dialogs/ExhibitionSettingsDialog.js";
import { useSnackbar, useTitle } from "../../ContextProviders/AppFeatures.js";
import { useAppUser } from "../../ContextProviders/AppUser.js";
import { doesItemMatchSearchQuery } from "../../Helpers/SearchUtilities.js";
import { CourseFilterMenu } from "../../Components/Menus/CourseFilterMenu.js";

import { useAccountNav } from "../../ContextProviders/AccountNavProvider.js";
import { Exhibition } from "../../Classes/Entities/Exhibition.js";
import { ManagementPageProvider, useItemsReducer } from "../../ContextProviders/ManagementPageProvider.js";

const ExhibitionManagement = () => {
    const [exhibitionsCombinedState, setExhibitions, setSelectedExhibitions, filterExhibitions] = useItemsReducer();
    const [courses, setCourses] = useState([]);

    const [refreshInProgress, setRefreshInProgress] = useState(true);

    const [isLoaded, setIsLoaded] = useState(false);
    const [isError, setIsError] = useState(false);

    const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false);
    const [deleteDialogExhibition, setDeleteDialogExhibition] = useState(null);

    const [editDialogIsOpen, setEditDialogIsOpen] = useState(false);
    const [editDialogExhibitionId, setEditDialogExhibitionId] = useState(null);
    const [editDialogExhibitionAccess, setEditDialogExhibitionAccess] = useState(null);
    const [editDialogExhibitionTitle, setEditDialogExhibitionTitle] = useState(null);

    const [searchQuery, setSearchQuery] = useState("");

    const [, setSelectedNavItem] = useAccountNav();
    const [appUser] = useAppUser();
    const showSnackbar = useSnackbar();
    const setTitleText = useTitle();

    const [userCourseIdFilter, setUserCourseIdFilter] = useState(null);

    const clearFilters = () => {
        setUserCourseIdFilter(null);
        setSearchQuery("");
    };

    const fetchData = useCallback(async () => {
        try {
            setIsError(false);
            const exhibitionData = await sendAuthenticatedRequest("GET", "/api/admin/exhibitions");

            setExhibitions(exhibitionData.data);

            const coursesById = {};
            for (const ex of exhibitionData.data) {
                for (const c of ex.User.Courses) {
                    coursesById[c.id] = c;
                }
            }
            setCourses(Object.values(coursesById));

            setTimeout(() => {
                setRefreshInProgress(false);
            }, 1000);

            setIsLoaded(true);
        } catch (error) {
            setIsError(true);
        }
    }, [setExhibitions]);

    useEffect(() => {
        setSelectedNavItem("Exhibition Management");
        setTitleText("Exhibition Management");
        if (appUser.is_admin) {
            fetchData();
        }
    }, [appUser, fetchData, setSelectedNavItem, setTitleText]);

    const exhibitionFilterFunction = useCallback((exhibition) => {
        return (
            !userCourseIdFilter || (userCourseIdFilter && exhibition.User.Courses.map((c) => c.id).includes(userCourseIdFilter.id))
        ) && doesItemMatchSearchQuery(searchQuery, exhibition, ["title"]);
    }, [searchQuery, userCourseIdFilter]);

    useEffect(() => {
        filterExhibitions(exhibitionFilterFunction);
    }, [filterExhibitions, exhibitionFilterFunction]);

    const handleExhibitionEditByAdmin = async (exhibitionId, title, privacy) => {
        try {
            await sendAuthenticatedRequest("PUT", `/api/admin/exhibitions/${exhibitionId}`, { title, privacy });
            setEditDialogIsOpen(false);
            setEditDialogExhibitionId(null);
            setEditDialogExhibitionTitle("");
            setEditDialogExhibitionAccess(null);
            showSnackbar("Exhibition updated", "success");
        } catch (e) {
            console.log(`Error updating exhibition: ${e.message}`);
            showSnackbar("Error updating exhibition", "error");
        }
        fetchData();
    };

    const handleOpenExhibitionSettings = useCallback((exhibition) => {
        setEditDialogExhibitionId(exhibition.id);
        setEditDialogExhibitionAccess(exhibition.privacy);
        setEditDialogExhibitionTitle(exhibition.title);
        setEditDialogIsOpen(true);
    }, [setEditDialogExhibitionId, setEditDialogExhibitionAccess, setEditDialogExhibitionTitle]);

    const handleOpenExhibitionDeleteDialog = useCallback((exhibition) => {
        setDeleteDialogExhibition(exhibition);
        setDeleteDialogIsOpen(true);
    }, [setDeleteDialogExhibition, setDeleteDialogIsOpen]);

    return (!appUser.is_admin &&
        <FullPageMessage
            Icon={LockIcon}
            buttonDestination="/Account/Profile"
            buttonText="Return to Profile"
            message="Insufficient Privileges"
        />
    ) || (appUser.pw_change_required &&
        <Navigate to="/Account/ChangePassword" />
    ) || (isError &&
        <FullPageMessage
            Icon={WarningIcon}
            buttonAction={fetchData}
            buttonText="Retry"
            message="Error loading exhibitions"
        />
    ) || (!isLoaded &&
        <FullPageMessage
            Icon={AccessTimeIcon}
            message="Loading exhibitions..."
        />
    ) || (
        <ManagementPageProvider
            itemsCombinedState={exhibitionsCombinedState}
            managementCallbacks={{
                handleOpenExhibitionSettings,
                handleOpenExhibitionDeleteDialog
            }}
            setItems={setExhibitions}
            setSelectedItems={setSelectedExhibitions}
        >
            <Box
                component={Paper}
                square
                sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    gridTemplateRows: "80px calc(100vh - 224px) 80px",
                    gridTemplateAreas: `
                    "top"
                    "table"
                    "bottom"
                `
                }}
            >
                <Stack
                    alignItems="center"
                    direction="row"
                    justifyContent="space-between"
                    padding={2}
                    spacing={2}
                    sx={{ gridArea: "top" }}
                >
                    <SearchBox
                        placeholder="Search by user name or email"
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        width="30%"
                    />

                    <CourseFilterMenu
                        courses={courses}
                        filterValue={userCourseIdFilter}
                        setFilterValue={setUserCourseIdFilter}
                    />

                    <Stack
                        direction="row"
                        spacing={2}
                    >
                        <Button
                            color="primary"
                            disabled={refreshInProgress}
                            onClick={() => {
                                setRefreshInProgress(true);
                                fetchData();
                            }}
                            startIcon={<RefreshIcon />}
                            variant="outlined"
                        >
                            <Typography variant="body1">
                                Refresh
                            </Typography>
                        </Button>

                        <Button
                            color="primary"
                            disabled={
                                !(searchQuery || userCourseIdFilter)
                            }
                            onClick={clearFilters}
                            startIcon={<FilterAltOffOutlinedIcon />}
                            variant={
                                exhibitionsCombinedState.visibleItems.length > 0 ? "outlined" : "contained"
                            }
                        >
                            <Typography variant="body1">
                                Clear Filters
                            </Typography>
                        </Button>
                    </Stack>
                </Stack>

                <Box sx={{ gridArea: "table" }}>
                    <DataTable
                        defaultSortAscending={false}
                        defaultSortColumn="Modified"
                        rowSelectionEnabled
                        tableFields={Exhibition.tableFields}
                        {...
                            (exhibitionsCombinedState.visibleItems.length === exhibitionsCombinedState.items.length && {
                                noContentMessage: "No exhibitions yet",
                                NoContentIcon: InfoIcon
                            }) || (exhibitionsCombinedState.visibleItems.length < exhibitionsCombinedState.items.length && {
                                noContentMessage: "No results",
                                noContentButtonAction: clearFilters,
                                noContentButtonText: "Clear Filters",
                                NoContentIcon: SearchIcon
                            })
                        }
                    />
                </Box>

                <Stack
                    alignItems="center"
                    direction="row"
                    justifyContent="space-between"
                    padding={2}
                    spacing={2}
                    sx={{ gridArea: "bottom" }}
                >
                    <SelectionSummary
                        entityPlural="exhibitions"
                        entitySingular="exhibition"
                        items={exhibitionsCombinedState.items}
                        selectedItems={exhibitionsCombinedState.selectedItems}
                        setSelectedItems={setSelectedExhibitions}
                        visibleItems={exhibitionsCombinedState.visibleItems}
                    />
                </Stack>

                <ExhibitionSettingsDialog
                    adminMode
                    dialogExhibitionAccess={editDialogExhibitionAccess}
                    dialogExhibitionId={editDialogExhibitionId}
                    dialogExhibitionTitle={editDialogExhibitionTitle}
                    dialogIsOpen={editDialogIsOpen}
                    editMode
                    handleExhibitionEdit={handleExhibitionEditByAdmin}
                    setDialogExhibitionAccess={setEditDialogExhibitionAccess}
                    setDialogExhibitionTitle={setEditDialogExhibitionTitle}
                    setDialogIsOpen={setEditDialogIsOpen}
                />

                <ItemSingleDeleteDialog
                    Entity={Exhibition}
                    allItems={exhibitionsCombinedState.items}
                    deleteDialogIsOpen={deleteDialogIsOpen}
                    deleteDialogItem={deleteDialogExhibition}
                    requireTypedConfirmation
                    setAllItems={setExhibitions}
                    setDeleteDialogIsOpen={setDeleteDialogIsOpen}
                />

            </Box>

        </ManagementPageProvider>
    );
};

export default ExhibitionManagement;
