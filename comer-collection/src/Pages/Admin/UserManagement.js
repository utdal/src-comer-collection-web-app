import React, { useCallback, useEffect, useState } from "react";
import {
    Stack,
    Button,
    Typography, Box, Paper
} from "@mui/material";
import { GroupAddIcon, SchoolIcon, LockIcon, AccessTimeIcon, WarningIcon } from "../../Imports/Icons.js";
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
import { sendAuthenticatedRequest } from "../../Helpers/APICalls.js";
import { CourseFilterMenu } from "../../Components/Menus/CourseFilterMenu.js";
import { useSnackbar, useTitle } from "../../ContextProviders/AppFeatures.js";
import { useAppUser } from "../../ContextProviders/AppUser.js";

import { UserResetPasswordDialog } from "../../Components/Dialogs/UserResetPasswordDialog.js";
import { useAccountNav } from "../../ContextProviders/AccountNavProvider.js";
import { User } from "../../Classes/Entities/User.js";
import { EnrollmentUserPrimary } from "../../Classes/Associations/Enrollment.js";
import { UserExhibition } from "../../Classes/Associations/UserExhibition.js";
import { ManagementPageProvider, useItemsReducer } from "../../ContextProviders/ManagementPageProvider.js";
import { ClearFilterButton } from "../../Components/Buttons/ClearFilterButton.js";
import { RefreshButton } from "../../Components/Buttons/RefreshButton.js";

const UserManagement = () => {
    const [usersCombinedState, setUsers, setSelectedUsers, filterUsers] = useItemsReducer(User);
    const [courses, setCourses] = useState([]);
    const [exhibitions, setExhibitions] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isError, setIsError] = useState(false);

    const [privilegesDialogIsOpen, setPrivilegesDialogIsOpen] = useState(false);
    const [privilegesDialogUser, setPrivilegesDialogUser] = useState(null);

    const [resetPasswordDialogIsOpen, setResetPasswordDialogIsOpen] = useState(false);
    const [resetPasswordDialogUser, setResetPasswordDialogUser] = useState(null);

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

    const [, setSelectedNavItem] = useAccountNav();
    const [appUser] = useAppUser();
    const showSnackbar = useSnackbar();
    const navigate = useNavigate();
    const setTitleText = useTitle();

    const fetchData = useCallback(async () => {
        try {
            setIsError(false);
            const userData = await sendAuthenticatedRequest("GET", "/api/admin/users");
            setUsers(userData.data);

            const courseData = await sendAuthenticatedRequest("GET", "/api/admin/courses");
            setCourses(courseData.data);

            const exhibitionData = await sendAuthenticatedRequest("GET", "/api/admin/exhibitions");
            setExhibitions(exhibitionData.data);

            setIsLoaded(true);
        } catch (e) {
            setIsError(true);
        }
    }, [setUsers]);

    useEffect(() => {
        setSelectedNavItem("User Management");
        setTitleText("User Management");
        if (appUser.is_admin) {
            fetchData();
        }
    }, [appUser.is_admin, fetchData, setSelectedNavItem, setTitleText]);

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
        setResetPasswordDialogUser(user);
        setResetPasswordDialogIsOpen(true);
    }, []);

    const handleOpenUserAssignCourseDialog = useCallback((user) => {
        setAssociationDialogUsers([user]);
        setAssignCourseDialogIsOpen(true);
    }, []);

    const handleOpenViewUserExhibitionDialog = useCallback((user) => {
        setAssociationDialogUsers([user]);
        setViewUserExhibitionDialogIsOpen(true);
    }, []);

    const handleOpenUserPrivilegesDialog = useCallback((user) => {
        setPrivilegesDialogUser(user);
        setPrivilegesDialogIsOpen(true);
    }, []);

    const handleChangeUserActivationStatus = useCallback((user, newStatus) => {
        User.handleChangeUserActivationStatus(user.id, newStatus).then((msg) => {
            fetchData();
            showSnackbar(msg, "success");
        }).catch((err) => {
            showSnackbar(err, "error");
        });
    }, [fetchData, showSnackbar]);

    const handleOpenUserEditDialog = useCallback((user) => {
        setEditDialogUser(user);
        setEditDialogIsOpen(true);
    }, []);

    const handleOpenUserDeleteDialog = useCallback((user) => {
        setDeleteDialogUser(user);
        setDeleteDialogIsOpen(true);
    }, []);

    const handleRefresh = useCallback(async () => {
        await fetchData();
    }, [fetchData]);

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
            buttonAction={fetchData}
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

                    <Stack
                        direction="row"
                        spacing={2}
                    >
                        <RefreshButton />

                        <ClearFilterButton />

                        <Button
                            color="primary"
                            onClick={() => {
                                setDialogIsOpen(true);
                            }}
                            startIcon={<GroupAddIcon />}
                            variant="contained"
                        >
                            <Typography variant="body1">
                                Create Users
                            </Typography>
                        </Button>
                    </Stack>
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

                    <Stack
                        direction="row"
                        spacing={2}
                    >
                        <Button
                            onClick={() => {
                                setAssociationDialogUsers([...usersCombinedState.selectedItems]);
                                setAssignCourseDialogIsOpen(true);
                            }}
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
                    </Stack>
                </Stack>

                <ItemMultiCreateDialog
                    Entity={User}
                    dialogInstructions={"Add users, edit the user fields, then click 'Create'.  You can set passwords after creating the users."}
                    dialogIsOpen={dialogIsOpen}
                    refreshAllItems={fetchData}
                    setDialogIsOpen={setDialogIsOpen}
                />

                <ItemSingleEditDialog
                    Entity={User}
                    editDialogIsOpen={editDialogIsOpen}
                    editDialogItem={editDialogUser}
                    refreshAllItems={fetchData}
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
                    refreshAllItems={fetchData}
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
                    refreshAllItems={fetchData}
                    secondaryItemsAll={exhibitions}
                    secondarySearchBoxPlaceholder="Search exhibitions by title"
                    secondarySearchFields={["title"]}
                    setDialogIsOpen={setViewUserExhibitionDialogIsOpen}
                />

                <UserChangePrivilegesDialog
                    dialogIsOpen={privilegesDialogIsOpen}
                    dialogUser={privilegesDialogUser}
                    refreshAllItems={fetchData}
                    setDialogIsOpen={setPrivilegesDialogIsOpen}
                />

                <UserResetPasswordDialog
                    dialogIsOpen={resetPasswordDialogIsOpen}
                    dialogUser={resetPasswordDialogUser}
                    setDialogIsOpen={setResetPasswordDialogIsOpen}
                />

            </Box>
        </ManagementPageProvider>
    );
};

export default UserManagement;
