import React, { useCallback, useEffect, useMemo, useState } from "react";
import SearchBox from "../../Components/SearchBox.js";
import { ItemSingleDeleteDialog } from "../../Components/Dialogs/ItemSingleDeleteDialog.js";
import { ItemMultiCreateDialog } from "../../Components/Dialogs/ItemMultiCreateDialog.js";
import { ItemSingleEditDialog } from "../../Components/Dialogs/ItemSingleEditDialog.js";
import { DataTable } from "../../Components/DataTable/DataTable.js";
import { doesItemMatchSearchQuery } from "../../Helpers/SearchUtilities.js";
import { AssociationManagementDialog } from "../../Components/Dialogs/AssociationManagementDialog/AssociationManagementDialog.js";
import { useLoaderData, useNavigate, useRevalidator } from "react-router";
import { SelectionSummary } from "../../Components/SelectionSummary.js";
import { useTitle } from "../../ContextProviders/AppFeatures.js";
import { Course } from "../../Classes/Entities/Course.js";
import { EnrollmentCoursePrimary } from "../../Classes/Associations/Enrollment.js";
import { ManagementPageProvider, useItemsReducer } from "../../ContextProviders/ManagementPageProvider.js";
import { ClearFilterButton } from "../../Components/Buttons/ClearFilterButton.js";
import { RefreshButton } from "../../Components/Buttons/RefreshButton.js";
import { MultiCreateButton } from "../../Components/Buttons/MultiCreateButton.js";
import { ManagementButtonStack } from "../../Components/ManagementPage/ManagementButtonStack.js";
import { User } from "../../Classes/Entities/User.js";
import { ManagementPageContainer } from "../../Components/ManagementPage/ManagementPageContainer.js";
import { ManagementPageHeader } from "../../Components/ManagementPage/ManagementPageHeader.js";
import { ManagementPageBody } from "../../Components/ManagementPage/ManagementPageBody.js";
import { ManagementPageFooter } from "../../Components/ManagementPage/ManagementPageFooter.js";
import { useDialogState } from "../../Hooks/useDialogState.js";
import AssociationManageButton from "../../Components/Buttons/AssociationManageButton.js";

const CourseManagement = () => {
    const courses = useLoaderData();
    const revalidator = useRevalidator();

    const [coursesCombinedState, {
        setItems: setCourses,
        setSelectedItems: setSelectedCourses,
        filterItems: filterCourses,
        setItemSelectionStatus: setCourseSelectionStatus,
        calculateSortableItemValues: calculateSortableCourseValues
    }] = useItemsReducer(courses);

    useEffect(() => {
        setCourses(courses);
    }, [setCourses, courses]);

    const handleRefresh = useCallback(async () => {
        revalidator.revalidate();
    }, [revalidator]);

    const [createDialogState, handleOpenMultiCreateDialog] = useDialogState();
    const [editDialogState, openEditDialog] = useDialogState(false);
    const [deleteDialogState, openDeleteDialog] = useDialogState(false);

    const [userDialogState, openUserDialog] = useDialogState(true);

    const [searchQuery, setSearchQuery] = useState("");

    const handleClearFilters = useCallback(() => {
        setSearchQuery("");
    }, []);

    const navigate = useNavigate();
    useTitle("Course Management");

    const courseFilterFunction = useCallback((course) => {
        return doesItemMatchSearchQuery(searchQuery, course, ["name", "notes"]);
    }, [searchQuery]);

    useEffect(() => {
        filterCourses(courseFilterFunction);
    }, [filterCourses, courseFilterFunction]);

    const handleOpenCourseEditDialog = useCallback((course) => {
        openEditDialog(course);
    }, [openEditDialog]);

    const handleOpenCourseDeleteDialog = useCallback((course) => {
        openDeleteDialog(course);
    }, [openDeleteDialog]);

    const handleOpenAssignCourseUserDialog = useCallback((course) => {
        openUserDialog([course]);
    }, [openUserDialog]);

    const handleSwitchToUsersView = useCallback(() => {
        navigate("/Account/Admin/Users");
    }, [navigate]);

    const managementCallbacks = useMemo(() => ({
        handleOpenCourseDeleteDialog,
        handleOpenCourseEditDialog,
        handleOpenMultiCreateDialog,
        handleOpenAssignCourseUserDialog,
        handleClearFilters,
        handleRefresh
    }), [handleClearFilters,
        handleOpenAssignCourseUserDialog,
        handleOpenCourseDeleteDialog,
        handleOpenCourseEditDialog,
        handleOpenMultiCreateDialog,
        handleRefresh
    ]);

    return (
        <ManagementPageProvider
            Entity={Course}
            calculateSortableItemValues={calculateSortableCourseValues}
            itemsCombinedState={coursesCombinedState}
            managementCallbacks={managementCallbacks}
            setItemSelectionStatus={setCourseSelectionStatus}
            setItems={setCourses}
            setSelectedItems={setSelectedCourses}
        >
            <ManagementPageContainer>
                <ManagementPageHeader>
                    <SearchBox
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        width="50%"
                    />

                    <ManagementButtonStack>
                        <RefreshButton />

                        <ClearFilterButton />

                        <MultiCreateButton />
                    </ManagementButtonStack>
                </ManagementPageHeader>

                <ManagementPageBody>
                    <DataTable
                        defaultSortAscending
                        defaultSortColumn="ID"
                        emptyMinHeight="300px"
                        rowSelectionEnabled
                        sx={{ gridArea: "table" }}
                        tableFields={Course.tableFields}
                    />
                </ManagementPageBody>

                <ManagementPageFooter>
                    <SelectionSummary />

                    <ManagementButtonStack>
                        <AssociationManageButton
                            handleOpenDialog={handleOpenAssignCourseUserDialog}
                            secondaryEntity={User}
                        />
                    </ManagementButtonStack>
                </ManagementPageFooter>

            </ManagementPageContainer>

            <ItemMultiCreateDialog dialogState={createDialogState} />

            <ItemSingleEditDialog dialogState={editDialogState} />

            <ItemSingleDeleteDialog dialogState={deleteDialogState} />

            <AssociationManagementDialog
                Association={EnrollmentCoursePrimary}
                defaultSortAscending
                defaultSortColumn="Name"
                dialogState={userDialogState}
                editMode
                handleSwitchToSecondary={handleSwitchToUsersView}
                secondaryItemsAll={[]}
            />
        </ManagementPageProvider>
    );
};

export default CourseManagement;
