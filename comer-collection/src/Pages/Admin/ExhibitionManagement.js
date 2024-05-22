import React, { useCallback, useEffect, useState } from "react";
import { FullPageMessage } from "../../Components/FullPageMessage.js";
import SearchBox from "../../Components/SearchBox.js";
import { LockIcon, WarningIcon, AccessTimeIcon } from "../../Imports/Icons.js";
import { ItemSingleDeleteDialog } from "../../Components/Dialogs/ItemSingleDeleteDialog.js";
import { DataTable } from "../../Components/DataTable/DataTable.js";
import { Navigate } from "react-router";
import { SelectionSummary } from "../../Components/SelectionSummary.js";
import { ExhibitionSettingsDialog } from "../../Components/Dialogs/ExhibitionSettingsDialog.js";
import { useTitle } from "../../ContextProviders/AppFeatures.js";
import { useAppUser } from "../../ContextProviders/AppUser.js";
import { doesItemMatchSearchQuery } from "../../Helpers/SearchUtilities.js";
import { CourseFilterMenu } from "../../Components/Menus/CourseFilterMenu.js";

import { useAccountNavTitle } from "../../Hooks/useAccountNavTitle.js";
import { Exhibition } from "../../Classes/Entities/Exhibition.js";
import { ManagementPageProvider, useItemsReducer } from "../../ContextProviders/ManagementPageProvider.js";
import { ClearFilterButton } from "../../Components/Buttons/ClearFilterButton.js";
import { RefreshButton } from "../../Components/Buttons/RefreshButton.js";
import { ManagementButtonStack } from "../../Components/ManagementPage/ManagementButtonStack.js";
import { ManagementPageContainer } from "../../Components/ManagementPage/ManagementPageContainer.js";
import { ManagementPageHeader } from "../../Components/ManagementPage/ManagementPageHeader.js";
import { ManagementPageBody } from "../../Components/ManagementPage/ManagementPageBody.js";
import { ManagementPageFooter } from "../../Components/ManagementPage/ManagementPageFooter.js";

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

    const [userCourseIdFilter, setUserCourseIdFilter] = useState(null);

    useAccountNavTitle("Exhibition Management");
    useTitle("Exhibition Management");

    const handleClearFilters = useCallback(() => {
        setUserCourseIdFilter(null);
        setSearchQuery("");
    }, []);

    const handleRefresh = useCallback(async () => {
        try {
            setIsError(false);

            const fetchedExhibitions = await Exhibition.handleFetchAll();
            setExhibitions(fetchedExhibitions);

            const coursesById = {};
            for (const ex of fetchedExhibitions) {
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
        if (appUser.is_admin) {
            handleRefresh();
        }
    }, [appUser, handleRefresh]);

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
            <ManagementPageContainer>
                <ManagementPageHeader>
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
                </ManagementPageHeader>

                <ManagementPageBody>
                    <DataTable
                        defaultSortAscending={false}
                        defaultSortColumn="Modified"
                        rowSelectionEnabled
                        tableFields={Exhibition.tableFields}
                    />
                </ManagementPageBody>

                <ManagementPageFooter>
                    <SelectionSummary />
                </ManagementPageFooter>

            </ManagementPageContainer>

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
