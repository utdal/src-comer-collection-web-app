import React, { useCallback, useEffect, useMemo, useState } from "react";
import SearchBox from "../../Components/SearchBox.js";
import { ItemSingleDeleteDialog } from "../../Components/Dialogs/ItemSingleDeleteDialog.js";
import { ItemMultiCreateDialog } from "../../Components/Dialogs/ItemMultiCreateDialog.js";
import { ItemSingleEditDialog } from "../../Components/Dialogs/ItemSingleEditDialog.js";
import { DataTable } from "../../Components/DataTable/DataTable.js";
import { doesItemMatchSearchQuery } from "../../Helpers/SearchUtilities.js";
import { AssociationManagementDialog } from "../../Components/Dialogs/AssociationManagementDialog/AssociationManagementDialog.js";
import { useLoaderData, useNavigate, useRevalidator } from "react-router";
import { UserChangePrivilegesDialog } from "../../Components/Dialogs/UserChangePrivilegesDialog.js";
import { SelectionSummary } from "../../Components/SelectionSummary.js";
import { CourseFilterMenu } from "../../Components/Menus/CourseFilterMenu.js";
import { useSnackbar, useTitle } from "../../ContextProviders/AppFeatures.js";

import { UserResetPasswordDialog } from "../../Components/Dialogs/UserResetPasswordDialog.js";
import { User } from "../../Classes/Entities/User.js";
import { EnrollmentUserPrimary } from "../../Classes/Associations/Enrollment.js";
import { UserExhibition } from "../../Classes/Associations/UserExhibition.js";
import { ManagementPageProvider, useItemsReducer } from "../../ContextProviders/ManagementPageProvider.js";
import { ClearFilterButton } from "../../Components/Buttons/ClearFilterButton.js";
import { RefreshButton } from "../../Components/Buttons/RefreshButton.js";
import { MultiCreateButton } from "../../Components/Buttons/MultiCreateButton.js";
import { ManagementButtonStack } from "../../Components/ManagementPage/ManagementButtonStack.js";
import { useDialogState } from "../../Hooks/useDialogState.js";
import { Course } from "../../Classes/Entities/Course.js";
import { ManagementPageContainer } from "../../Components/ManagementPage/ManagementPageContainer.js";
import { ManagementPageHeader } from "../../Components/ManagementPage/ManagementPageHeader.js";
import { ManagementPageBody } from "../../Components/ManagementPage/ManagementPageBody.js";
import { ManagementPageFooter } from "../../Components/ManagementPage/ManagementPageFooter.js";
import AssociationManageButton from "../../Components/Buttons/AssociationManageButton.js";
import PaginationSummary from "../../Components/PaginationSummary/PaginationSummary.js";

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

    const [privilegesDialogState, openPrivilegesDialog] = useDialogState(false, User);

    const [resetPasswordDialogState, openResetPasswordDialog] = useDialogState(false, User);

    const [createDialogState, handleOpenMultiCreateDialog] = useDialogState();
    const [editDialogState, openEditDialog] = useDialogState(false);
    const [deleteDialogState, openDeleteDialog] = useDialogState(false);

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

    const handleNavigateToChangePassword = useCallback(() => {
        navigate("/Account/ChangePassword");
    }, [navigate]);

    const handleOpenUserPasswordResetDialog = useCallback((user) => {
        openResetPasswordDialog(user);
    }, [openResetPasswordDialog]);

    const handleOpenUserAssignCourseDialog = useCallback((user) => {
        openCourseDialog([user]);
    }, [openCourseDialog]);

    const handleOpenUserAssignCourseDialogForSelectedUsers = useCallback(() => {
        openCourseDialog(usersCombinedState.selectedItems);
    }, [openCourseDialog, usersCombinedState.selectedItems]);

    const handleOpenViewUserExhibitionDialog = useCallback((user) => {
        openExhibitionDialog([user]);
    }, [openExhibitionDialog]);

    const handleOpenUserPrivilegesDialog = useCallback((user) => {
        openPrivilegesDialog(user);
    }, [openPrivilegesDialog]);

    const handleChangeUserActivationStatus = useCallback((user, newStatus) => {
        User.handleChangeUserActivationStatus(user.id, newStatus).then((msg) => {
            handleRefresh();
            showSnackbar(msg, "success");
        }).catch((err) => {
            showSnackbar(err, "error");
        });
    }, [handleRefresh, showSnackbar]);

    const handleOpenUserEditDialog = useCallback((user) => {
        openEditDialog(user);
    }, [openEditDialog]);

    const handleOpenUserDeleteDialog = useCallback((user) => {
        openDeleteDialog(user);
    }, [openDeleteDialog]);

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
        handleNavigateToChangePassword,
        handleOpenUserPasswordResetDialog,
        handleOpenUserAssignCourseDialog,
        handleOpenViewUserExhibitionDialog,
        handleOpenUserPrivilegesDialog,
        handleChangeUserActivationStatus,
        handleOpenMultiCreateDialog,
        handleOpenUserEditDialog,
        handleOpenUserDeleteDialog,
        handleClearFilters,
        handleRefresh
    }), [handleChangeUserActivationStatus,
        handleClearFilters,
        handleNavigateToChangePassword,
        handleOpenMultiCreateDialog,
        handleOpenUserAssignCourseDialog,
        handleOpenUserDeleteDialog,
        handleOpenUserEditDialog,
        handleOpenUserPasswordResetDialog,
        handleOpenUserPrivilegesDialog,
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

            <ItemMultiCreateDialog dialogState={createDialogState} />

            <ItemSingleEditDialog dialogState={editDialogState} />

            <ItemSingleDeleteDialog dialogState={deleteDialogState} />

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

            <UserChangePrivilegesDialog dialogState={privilegesDialogState} />

            <UserResetPasswordDialog dialogState={resetPasswordDialogState} />
        </ManagementPageProvider>
    );
};

export default UserManagement;
