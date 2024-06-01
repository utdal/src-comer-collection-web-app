import React, { useCallback, useEffect, useMemo, useState } from "react";
import SearchBox from "../../Components/SearchBox";
import { DataTable } from "../../Components/DataTable/DataTable.js";
import { doesItemMatchSearchQuery } from "../../Helpers/SearchUtilities.js";
import { AssociationManagementDialog } from "../../Components/Dialogs/AssociationManagementDialog/AssociationManagementDialog.js";
import { useLoaderData, useNavigate, useRevalidator } from "react-router";
import { SelectionSummary } from "../../Components/SelectionSummary.js";
import { CourseFilterMenu } from "../../Components/Menus/CourseFilterMenu.js";
import { useSnackbar, useTitle } from "../../ContextProviders/AppFeatures";

import { User } from "../../Classes/Entities/User.ts";
import { EnrollmentUserPrimary } from "../../Classes/Associations/Enrollment.ts";
import { UserExhibition } from "../../Classes/Associations/UserExhibition.ts";
import { ManagementPageProvider, useItemsReducer } from "../../ContextProviders/ManagementPageProvider";
import { ClearFilterButton } from "../../Components/Buttons/ClearFilterButton.js";
import { RefreshButton } from "../../Components/Buttons/RefreshButton.js";
import { MultiCreateButton } from "../../Components/Buttons/MultiCreateButton.js";
import { ManagementButtonStack } from "../../Components/ManagementPage/ManagementButtonStack.js";
import { useDialogState } from "../../Hooks/useDialogState.js";
import { Course } from "../../Classes/Entities/Course.ts";
import { ManagementPageContainer } from "../../Components/ManagementPage/ManagementPageContainer.js";
import { ManagementPageHeader } from "../../Components/ManagementPage/ManagementPageHeader.js";
import { ManagementPageBody } from "../../Components/ManagementPage/ManagementPageBody.js";
import { ManagementPageFooter } from "../../Components/ManagementPage/ManagementPageFooter.js";
import AssociationManageButton from "../../Components/Buttons/AssociationManageButton.js";
import PaginationSummary from "../../Components/PaginationSummary/PaginationSummary.js";
import useDialogStates from "../../Hooks/useDialogStates.js";
import DialogByIntent from "../../Components/Dialogs/DialogByIntent.js";

const UserManagement = () => {
    const users = useLoaderData();
    const revalidator = useRevalidator();

    const [usersCombinedState, itemsCallbacks] = useItemsReducer(users);

    const {
        setItems: setUsers,
        setSelectedItems: setSelectedUsers,
        filterItems: filterUsers,
        setItemSelectionStatus: setUserSelectionStatus,
        calculateSortableItemValues: calculateSortableUserValues
    } = itemsCallbacks;

    useEffect(() => {
        setUsers(users);
    }, [setUsers, users]);

    const handleRefresh = useCallback(async () => {
        revalidator.revalidate();
    }, [revalidator]);

    /**
     * @type {Intent[]}
     */
    const intentArray = ["multi-create", "single-edit", "single-delete", "user-reset-password", "user-change-privileges"];
    const {
        dialogStateDictionary,
        openDialogByIntentWithNoUnderlyingItems,
        openDialogByIntentWithSingleUnderlyingItem,
        openDialogByIntentWithMultipleUnderlyingItems,
        closeDialogByIntent
    } = useDialogStates(intentArray);

    const [courseDialogState, openCourseDialog] = useDialogState(true);
    const [exhibitionDialogState, openExhibitionDialog] = useDialogState(true);

    const [searchQuery, setSearchQuery] = useState("");
    const [userCourseIdFilter, setUserCourseIdFilter] = useState(null);

    const handleClearFilters = useCallback(() => {
        setSearchQuery("");
        setUserCourseIdFilter(null);
    }, []);

    const showSnackbar = useSnackbar();
    const navigate = useNavigate();
    useTitle("User Management");

    const userFilterFunction = useCallback((user) => {
        return (
            !userCourseIdFilter || (userCourseIdFilter && user.Courses.map((c) => c.id).includes(userCourseIdFilter.id))
        ) && (
            doesItemMatchSearchQuery(searchQuery, user, ["full_name", "full_name_reverse", "email_without_domain"])
        );
    }, [userCourseIdFilter, searchQuery]);

    const handleOpenUserAssignCourseDialog = useCallback((user) => {
        openCourseDialog([user]);
    }, [openCourseDialog]);

    const handleOpenUserAssignCourseDialogForSelectedUsers = useCallback(() => {
        openCourseDialog(usersCombinedState.selectedItems);
    }, [openCourseDialog, usersCombinedState.selectedItems]);

    const handleOpenViewUserExhibitionDialog = useCallback((user) => {
        openExhibitionDialog([user]);
    }, [openExhibitionDialog]);

    const handleChangeUserActivationStatus = useCallback((user, newStatus) => {
        User.handleChangeUserActivationStatus(user.id, newStatus).then((msg) => {
            handleRefresh();
            showSnackbar(msg, "success");
        }).catch((err) => {
            showSnackbar(err, "error");
        });
    }, [handleRefresh, showSnackbar]);

    const handleSwitchToCoursesView = useCallback(() => {
        navigate("/Account/Admin/Courses");
    }, [navigate]);

    const handleSwitchToExhibitionsView = useCallback(() => {
        navigate("/Account/Admin/Exhibitions");
    }, [navigate]);

    useEffect(() => {
        filterUsers(userFilterFunction);
    }, [filterUsers, userFilterFunction]);

    const managementCallbacks = useMemo(() => ({
        handleOpenUserAssignCourseDialog,
        handleOpenViewUserExhibitionDialog,
        handleChangeUserActivationStatus,
        openDialogByIntentWithNoUnderlyingItems,
        openDialogByIntentWithSingleUnderlyingItem,
        openDialogByIntentWithMultipleUnderlyingItems,
        closeDialogByIntent,
        handleClearFilters,
        handleRefresh
    }), [handleChangeUserActivationStatus,
        handleClearFilters,
        openDialogByIntentWithNoUnderlyingItems,
        openDialogByIntentWithSingleUnderlyingItem,
        openDialogByIntentWithMultipleUnderlyingItems,
        closeDialogByIntent,
        handleOpenUserAssignCourseDialog,
        handleOpenViewUserExhibitionDialog,
        handleRefresh]);

    return (
        <ManagementPageProvider
            Entity={User}
            calculateSortableItemValues={calculateSortableUserValues}
            itemsCallbacks={itemsCallbacks}
            itemsCombinedState={usersCombinedState}
            managementCallbacks={managementCallbacks}
            setItemSelectionStatus={setUserSelectionStatus}
            setItems={setUsers}
            setSelectedItems={setSelectedUsers}
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

                        <MultiCreateButton />
                    </ManagementButtonStack>
                </ManagementPageHeader>

                <ManagementPageBody>
                    <DataTable
                        emptyMinHeight="300px"
                        rowSelectionEnabled
                        tableFields={User.tableFields}
                    />
                </ManagementPageBody>

                <ManagementPageFooter>
                    <SelectionSummary />

                    <ManagementButtonStack>
                        <AssociationManageButton
                            handleOpenDialog={handleOpenUserAssignCourseDialogForSelectedUsers}
                            secondaryEntity={Course}
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
                Association={EnrollmentUserPrimary}
                dialogState={courseDialogState}
                editMode
                handleSwitchToSecondary={handleSwitchToCoursesView}
                secondaryItemsAll={[]}
            />

            <AssociationManagementDialog
                Association={UserExhibition}
                dialogState={exhibitionDialogState}
                handleSwitchToSecondary={handleSwitchToExhibitionsView}
                secondaryItemsAll={[]}
            />

        </ManagementPageProvider>
    );
};

export default UserManagement;
