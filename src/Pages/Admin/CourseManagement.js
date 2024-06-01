import React, { useCallback, useEffect, useMemo, useState } from "react";
import SearchBox from "../../Components/SearchBox";
import { DataTable } from "../../Components/DataTable/DataTable.js";
import { doesItemMatchSearchQuery } from "../../Helpers/SearchUtilities.js";
import { AssociationManagementDialog } from "../../Components/Dialogs/AssociationManagementDialog/AssociationManagementDialog.js";
import { useLoaderData, useNavigate, useRevalidator } from "react-router";
import { SelectionSummary } from "../../Components/SelectionSummary.js";
import { useTitle } from "../../ContextProviders/AppFeatures";
import { Course } from "../../Classes/Entities/Course.ts";
import { EnrollmentCoursePrimary } from "../../Classes/Associations/Enrollment.ts";
import { ManagementPageProvider, useItemsReducer } from "../../ContextProviders/ManagementPageProvider";
import { ClearFilterButton } from "../../Components/Buttons/ClearFilterButton.js";
import { RefreshButton } from "../../Components/Buttons/RefreshButton.js";
import { MultiCreateButton } from "../../Components/Buttons/MultiCreateButton.js";
import { ManagementButtonStack } from "../../Components/ManagementPage/ManagementButtonStack.js";
import { User } from "../../Classes/Entities/User.ts";
import { ManagementPageContainer } from "../../Components/ManagementPage/ManagementPageContainer.js";
import { ManagementPageHeader } from "../../Components/ManagementPage/ManagementPageHeader.js";
import { ManagementPageBody } from "../../Components/ManagementPage/ManagementPageBody.js";
import { ManagementPageFooter } from "../../Components/ManagementPage/ManagementPageFooter.js";
import { useDialogState } from "../../Hooks/useDialogState.js";
import AssociationManageButton from "../../Components/Buttons/AssociationManageButton.js";
import PaginationSummary from "../../Components/PaginationSummary/PaginationSummary.js";
import DialogByIntent from "../../Components/Dialogs/DialogByIntent.js";
import useDialogStates from "../../Hooks/useDialogStates.js";

const CourseManagement = () => {
    const courses = useLoaderData();
    const revalidator = useRevalidator();

    const [coursesCombinedState, itemsCallbacks] = useItemsReducer(courses);

    const {
        setItems: setCourses,
        filterItems: filterCourses
    } = itemsCallbacks;

    useEffect(() => {
        setCourses(courses);
    }, [setCourses, courses]);

    const handleRefresh = useCallback(async () => {
        revalidator.revalidate();
    }, [revalidator]);

    /**
     * @type {Intent[]}
     */
    const intentArray = ["multi-create", "single-edit", "single-delete"];
    const {
        dialogStateDictionary,
        openDialogByIntentWithNoUnderlyingItems,
        openDialogByIntentWithSingleUnderlyingItem,
        openDialogByIntentWithMultipleUnderlyingItems,
        closeDialogByIntent
    } = useDialogStates(intentArray);

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

    const handleOpenAssignCourseUserDialog = useCallback((course) => {
        openUserDialog([course]);
    }, [openUserDialog]);

    const handleSwitchToUsersView = useCallback(() => {
        navigate("/Account/Admin/Users");
    }, [navigate]);

    const managementCallbacks = useMemo(() => ({
        openDialogByIntentWithNoUnderlyingItems,
        openDialogByIntentWithSingleUnderlyingItem,
        openDialogByIntentWithMultipleUnderlyingItems,
        closeDialogByIntent,
        handleOpenAssignCourseUserDialog,
        handleClearFilters,
        handleRefresh
    }), [handleClearFilters,
        handleOpenAssignCourseUserDialog,
        openDialogByIntentWithNoUnderlyingItems,
        openDialogByIntentWithSingleUnderlyingItem,
        openDialogByIntentWithMultipleUnderlyingItems,
        closeDialogByIntent,
        handleRefresh
    ]);

    return (
        <ManagementPageProvider
            Entity={Course}
            itemsCallbacks={itemsCallbacks}
            itemsCombinedState={coursesCombinedState}
            managementCallbacks={managementCallbacks}
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
                        emptyMinHeight="300px"
                        rowSelectionEnabled
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

                    <PaginationSummary />
                </ManagementPageFooter>

            </ManagementPageContainer>

            {intentArray.map((intent) => (
                <DialogByIntent
                    dialogState={dialogStateDictionary[intent]}
                    intent={intent}
                    key={intent}
                />
            ))}

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
