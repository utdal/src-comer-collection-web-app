import React, { useCallback, useEffect, useState } from "react";
import {
    Stack, Box, Paper
} from "@mui/material";
import { FullPageMessage } from "../../Components/FullPageMessage.js";
import SearchBox from "../../Components/SearchBox.js";
import { LockIcon, WarningIcon, AccessTimeIcon } from "../../Imports/Icons.js";
import { ItemSingleDeleteDialog } from "../../Components/Dialogs/ItemSingleDeleteDialog.js";
import { DataTable } from "../../Components/DataTable/DataTable.js";
import { Navigate } from "react-router";
import { SelectionSummary } from "../../Components/SelectionSummary.js";
import { sendAuthenticatedRequest } from "../../Helpers/APICalls.js";
import { ExhibitionSettingsDialog } from "../../Components/Dialogs/ExhibitionSettingsDialog.js";
import { useTitle } from "../../ContextProviders/AppFeatures.js";
import { useAppUser } from "../../ContextProviders/AppUser.js";
import { doesItemMatchSearchQuery } from "../../Helpers/SearchUtilities.js";
import { CourseFilterMenu } from "../../Components/Menus/CourseFilterMenu.js";

import { useAccountNavTitle } from "../../ContextProviders/AccountNavProvider.js";
import { Exhibition } from "../../Classes/Entities/Exhibition.js";
import { ManagementPageProvider, useItemsReducer } from "../../ContextProviders/ManagementPageProvider.js";
import { ClearFilterButton } from "../../Components/Buttons/ClearFilterButton.js";
import { RefreshButton } from "../../Components/Buttons/RefreshButton.js";
import { ManagementButtonStack } from "../../Components/ManagementPage/ManagementButtonStack.js";

const ExhibitionManagement = () => {
    const [exhibitionsCombinedState, setExhibitions, setSelectedExhibitions, filterExhibitions] = useItemsReducer(Exhibition);
    const [courses, setCourses] = useState([]);

    const [isLoaded, setIsLoaded] = useState(false);
    const [isError, setIsError] = useState(false);

    const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false);
    const [deleteDialogExhibition, setDeleteDialogExhibition] = useState(null);

    const [editDialogIsOpen, setEditDialogIsOpen] = useState(false);
    const [editDialogExhibitionId, setEditDialogExhibitionId] = useState(null);
    const [editDialogExhibitionAccess, setEditDialogExhibitionAccess] = useState(null);
    const [editDialogExhibitionTitle, setEditDialogExhibitionTitle] = useState(null);

    const [searchQuery, setSearchQuery] = useState("");

    const [appUser] = useAppUser();
    const setTitleText = useTitle();

    const [userCourseIdFilter, setUserCourseIdFilter] = useState(null);

    useAccountNavTitle("Exhibition Management");

    const handleClearFilters = useCallback(() => {
        setUserCourseIdFilter(null);
        setSearchQuery("");
    }, []);

    const handleRefresh = useCallback(async () => {
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

            setIsLoaded(true);
        } catch (error) {
            setIsError(true);
        }
    }, [setExhibitions]);

    useEffect(() => {
        setTitleText("Exhibition Management");
        if (appUser.is_admin) {
            handleRefresh();
        }
    }, [appUser, handleRefresh, setTitleText]);

    const exhibitionFilterFunction = useCallback((exhibition) => {
        return (
            !userCourseIdFilter || (userCourseIdFilter && exhibition.User.Courses.map((c) => c.id).includes(userCourseIdFilter.id))
        ) && doesItemMatchSearchQuery(searchQuery, exhibition, ["title"]);
    }, [searchQuery, userCourseIdFilter]);

    useEffect(() => {
        filterExhibitions(exhibitionFilterFunction);
    }, [filterExhibitions, exhibitionFilterFunction]);

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
            buttonAction={handleRefresh}
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
            Entity={Exhibition}
            itemsCombinedState={exhibitionsCombinedState}
            managementCallbacks={{
                handleOpenExhibitionSettings,
                handleOpenExhibitionDeleteDialog,
                handleClearFilters,
                handleRefresh
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

                    <ManagementButtonStack>

                        <RefreshButton />

                        <ClearFilterButton />

                    </ManagementButtonStack>
                </Stack>

                <Box sx={{ gridArea: "table" }}>
                    <DataTable
                        defaultSortAscending={false}
                        defaultSortColumn="Modified"
                        rowSelectionEnabled
                        tableFields={Exhibition.tableFields}
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
                    <SelectionSummary />
                </Stack>

            </Box>

            <ExhibitionSettingsDialog
                adminMode
                dialogExhibitionAccess={editDialogExhibitionAccess}
                dialogExhibitionId={editDialogExhibitionId}
                dialogExhibitionTitle={editDialogExhibitionTitle}
                dialogIsOpen={editDialogIsOpen}
                editMode
                refreshFunction={handleRefresh}
                setDialogExhibitionAccess={setEditDialogExhibitionAccess}
                setDialogExhibitionId={setEditDialogExhibitionId}
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

        </ManagementPageProvider>
    );
};

export default ExhibitionManagement;
