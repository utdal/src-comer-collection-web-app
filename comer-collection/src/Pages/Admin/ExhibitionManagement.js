import React, { useCallback, useEffect, useMemo, useState } from "react";
import SearchBox from "../../Components/SearchBox.js";
import { ItemSingleDeleteDialog } from "../../Components/Dialogs/ItemSingleDeleteDialog.js";
import { DataTable } from "../../Components/DataTable/DataTable.js";
import { SelectionSummary } from "../../Components/SelectionSummary.js";
import { ExhibitionSettingsDialog } from "../../Components/Dialogs/ExhibitionSettingsDialog.js";
import { useTitle } from "../../ContextProviders/AppFeatures.js";
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
import { useDialogState } from "../../Hooks/useDialogState.js";

const ExhibitionManagement = () => {
    const [exhibitionsCombinedState, setExhibitions, setSelectedExhibitions, filterExhibitions, setExhibitionSelectionStatus] = useItemsReducer(Exhibition);

    const [isLoaded, setIsLoaded] = useState(false);
    const [isError, setIsError] = useState(false);

    const [editDialogIsOpen, setEditDialogIsOpen] = useState(false);
    const [editDialogExhibitionId, setEditDialogExhibitionId] = useState(null);
    const [editDialogExhibitionAccess, setEditDialogExhibitionAccess] = useState(null);
    const [editDialogExhibitionTitle, setEditDialogExhibitionTitle] = useState(null);

    const [deleteDialogState, openDeleteDialog] = useDialogState(false);

    const [searchQuery, setSearchQuery] = useState("");

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
            setExhibitions(await Exhibition.handleFetchAll());
            setIsLoaded(true);
        } catch (error) {
            setIsError(true);
            setIsLoaded(false);
        }
    }, [setExhibitions]);

    useEffect(() => {
        handleRefresh();
    }, [handleRefresh]);

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
        openDeleteDialog(exhibition);
    }, [openDeleteDialog]);

    const managementCallbacks = useMemo(() => ({
        handleOpenExhibitionSettings,
        handleOpenExhibitionDeleteDialog,
        handleClearFilters,
        handleRefresh
    }), [handleClearFilters,
        handleOpenExhibitionDeleteDialog,
        handleOpenExhibitionSettings,
        handleRefresh
    ]);

    return (
        <ManagementPageProvider
            Entity={Exhibition}
            isError={isError}
            isLoaded={isLoaded}
            itemsCombinedState={exhibitionsCombinedState}
            managementCallbacks={managementCallbacks}
            setItemSelectionStatus={setExhibitionSelectionStatus}
            setItems={setExhibitions}
            setSelectedItems={setSelectedExhibitions}
        >
            <ManagementPageContainer>
                <ManagementPageHeader>
                    <SearchBox
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        width="30%"
                    />

                    <CourseFilterMenu
                        courses={[]}
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
                dialogState={deleteDialogState}
                requireTypedConfirmation
            />

        </ManagementPageProvider>
    );
};

export default ExhibitionManagement;
