import React, { useCallback, useEffect, useState } from "react";
import {
    Stack,
    Button,
    Typography, Box, Paper
} from "@mui/material";
import { SchoolIcon, LockIcon, AccessTimeIcon, WarningIcon } from "../../Imports/Icons.js";
import { FullPageMessage } from "../../Components/FullPageMessage.js";
import SearchBox from "../../Components/SearchBox.js";
import { ItemSingleDeleteDialog } from "../../Components/Dialogs/ItemSingleDeleteDialog.js";
import { ItemMultiCreateDialog } from "../../Components/Dialogs/ItemMultiCreateDialog.js";
import { ItemSingleEditDialog } from "../../Components/Dialogs/ItemSingleEditDialog.js";
import { DataTable } from "../../Components/DataTable/DataTable.js";
import { doesItemMatchSearchQuery } from "../../Helpers/SearchUtilities.js";
import { AssociationManagementDialog } from "../../Components/Dialogs/AssociationManagementDialog/AssociationManagementDialog.js";
import { Navigate, useNavigate } from "react-router";
import { UserChangePrivilegesDialog } from "../../Components/Dialogs/UserChangePrivilegesDialog.js";
import { SelectionSummary } from "../../Components/SelectionSummary.js";
import { CourseFilterMenu } from "../../Components/Menus/CourseFilterMenu.js";
import { useSnackbar, useTitle } from "../../ContextProviders/AppFeatures.js";
import { useAppUser } from "../../ContextProviders/AppUser.js";

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
import { useAccountNavTitle } from "../../Hooks/useAccountNavTitle.js";
import { Course } from "../../Classes/Entities/Course.js";
import { Exhibition } from "../../Classes/Entities/Exhibition.js";

const UserManagement = () => {
    const [usersCombinedState, setUsers, setSelectedUsers, filterUsers] = useItemsReducer(User);
    const [courses, setCourses] = useState([]);
    const [exhibitions, setExhibitions] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isError, setIsError] = useState(false);

    const [privilegesDialogState, openPrivilegesDialog] = useDialogState(false, User);

    const [resetPasswordDialogState, openResetPasswordDialog] = useDialogState(false, User);

    const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false);
    const [deleteDialogUser, setDeleteDialogUser] = useState(null);

    const [editDialogIsOpen, setEditDialogIsOpen] = useState(false);
    const [editDialogUser, setEditDialogUser] = useState(null);

    const [assignCourseDialogIsOpen, setAssignCourseDialogIsOpen] = useState(false);
    const [viewUserExhibitionDialogIsOpen, setViewUserExhibitionDialogIsOpen] = useState(false);
    const [associationDialogUsers, setAssociationDialogUsers] = useState([]);

    const [dialogIsOpen, setDialogIsOpen] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");
    const [userCourseIdFilter, setUserCourseIdFilter] = useState(null);

    const handleClearFilters = useCallback(() => {
        setSearchQuery("");
        setUserCourseIdFilter(null);
    }, []);

    const [appUser] = useAppUser();
    const showSnackbar = useSnackbar();
    const navigate = useNavigate();
    useTitle("User Management");

    useAccountNavTitle("User Management");

    const handleRefresh = useCallback(async () => {
        try {
            setIsError(false);

            const [fetchedUsers, fetchedCourses, fetchedExhibitions] = await Promise.all([
                User.handleFetchAll(),
                Course.handleFetchAll(),
                Exhibition.handleFetchAll()
            ]);

            setUsers(fetchedUsers);
            setCourses(fetchedCourses);
            setExhibitions(fetchedExhibitions);

            setIsLoaded(true);
        } catch (e) {
            setIsError(true);
        }
    }, [setUsers]);

    useEffect(() => {
        if (appUser.is_admin) {
            handleRefresh();
        }
    }, [appUser.is_admin, handleRefresh]);

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
        setAssociationDialogUsers([user]);
        setAssignCourseDialogIsOpen(true);
    }, []);

    const handleOpenUserAssignCourseDialogForSelectedUsers = useCallback(() => {
        setAssociationDialogUsers([...usersCombinedState.selectedItems]);
        setAssignCourseDialogIsOpen(true);
    }, [usersCombinedState.selectedItems]);

    const handleOpenViewUserExhibitionDialog = useCallback((user) => {
        setAssociationDialogUsers([user]);
        setViewUserExhibitionDialogIsOpen(true);
    }, []);

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

    const handleOpenMultiCreateDialog = useCallback(() => {
        setDialogIsOpen(true);
    }, []);

    const handleOpenUserEditDialog = useCallback((user) => {
        setEditDialogUser(user);
        setEditDialogIsOpen(true);
    }, []);

    const handleOpenUserDeleteDialog = useCallback((user) => {
        setDeleteDialogUser(user);
        setDeleteDialogIsOpen(true);
    }, []);

    useEffect(() => {
        filterUsers(userFilterFunction);
    }, [filterUsers, userFilterFunction]);

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
        message="Error loading users"
    />
    ) || (!isLoaded &&
    <FullPageMessage
        Icon={AccessTimeIcon}
        message="Loading users..."
    />
    ) || (
        <ManagementPageProvider
            Entity={User}
            itemsCombinedState={usersCombinedState}
            managementCallbacks={{
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
            }}
            setItems={setUsers}
            setSelectedItems={setSelectedUsers}
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

                        <MultiCreateButton />
                    </ManagementButtonStack>
                </Stack>

                <DataTable
                    emptyMinHeight="300px"
                    rowSelectionEnabled
                    sx={{ gridArea: "table" }}
                    tableFields={User.tableFields}
                />

                <Stack
                    alignItems="center"
                    direction="row"
                    justifyContent="space-between"
                    padding={2}
                    spacing={2}
                    sx={{ gridArea: "bottom" }}
                >
                    <SelectionSummary />

                    <ManagementButtonStack>
                        <Button
                            onClick={handleOpenUserAssignCourseDialogForSelectedUsers}
                            startIcon={<SchoolIcon />}
                            sx={{
                                display: usersCombinedState.selectedItems.length === 0 ? "none" : ""
                            }}
                            variant="outlined"
                        >
                            <Typography variant="body1">
                                Manage Course Enrollments for
                                {usersCombinedState.selectedItems.length}

                                {" "}

                                {usersCombinedState.selectedItems.length === 1 ? "user" : "users"}
                            </Typography>
                        </Button>
                    </ManagementButtonStack>
                </Stack>

            </Box>

            <ItemMultiCreateDialog
                Entity={User}
                dialogInstructions={"Add users, edit the user fields, then click 'Create'.  You can set passwords after creating the users."}
                dialogIsOpen={dialogIsOpen}
                refreshAllItems={handleRefresh}
                setDialogIsOpen={setDialogIsOpen}
            />

            <ItemSingleEditDialog
                Entity={User}
                editDialogIsOpen={editDialogIsOpen}
                editDialogItem={editDialogUser}
                refreshAllItems={handleRefresh}
                setEditDialogIsOpen={setEditDialogIsOpen}
            />

            <ItemSingleDeleteDialog
                Entity={User}
                allItems={usersCombinedState.items}
                deleteDialogIsOpen={deleteDialogIsOpen}
                deleteDialogItem={deleteDialogUser}
                setAllItems={setUsers}
                setDeleteDialogIsOpen={setDeleteDialogIsOpen}
            />

            <AssociationManagementDialog
                Association={EnrollmentUserPrimary}
                dialogButtonForSecondaryManagement={
                    <Button
                        onClick={() => {
                            navigate("/Account/Admin/Courses");
                        }}
                        variant="outlined"
                    >
                        <Typography>
                            Go to course management
                        </Typography>
                    </Button>
                }
                dialogIsOpen={assignCourseDialogIsOpen}
                editMode
                primaryItems={associationDialogUsers}
                refreshAllItems={handleRefresh}
                secondaryItemsAll={courses}
                secondarySearchBoxPlaceholder="Search courses by name"
                secondarySearchFields={["name"]}
                setDialogIsOpen={setAssignCourseDialogIsOpen}
            />

            <AssociationManagementDialog
                Association={UserExhibition}
                dialogButtonForSecondaryManagement={
                    <Button
                        onClick={() => {
                            navigate("/Account/Admin/Exhibitions");
                        }}
                        variant="outlined"
                    >
                        <Typography>
                            Go to exhibition management
                        </Typography>
                    </Button>
                }
                dialogIsOpen={viewUserExhibitionDialogIsOpen}
                editMode={false}
                primaryItems={associationDialogUsers}
                refreshAllItems={handleRefresh}
                secondaryItemsAll={exhibitions}
                secondarySearchBoxPlaceholder="Search exhibitions by title"
                secondarySearchFields={["title"]}
                setDialogIsOpen={setViewUserExhibitionDialogIsOpen}
            />

            <UserChangePrivilegesDialog
                dialogState={privilegesDialogState}
                refreshAllItems={handleRefresh}
            />

            <UserResetPasswordDialog
                dialogState={resetPasswordDialogState}
            />
        </ManagementPageProvider>
    );
};

export default UserManagement;
