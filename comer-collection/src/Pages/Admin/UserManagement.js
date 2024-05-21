import React, { useCallback, useEffect, useState } from "react";
import {
    Stack,
    Button,
    Typography, Box, Paper
} from "@mui/material";
import { FilterAltOffOutlinedIcon, GroupAddIcon, RefreshIcon, SchoolIcon, SearchIcon, InfoIcon, LockIcon, AccessTimeIcon, WarningIcon } from "../../Imports/Icons.js";
import { FullPageMessage } from "../../Components/FullPageMessage.js";
import SearchBox from "../../Components/SearchBox.js";
import { ItemSingleDeleteDialog } from "../../Components/Dialogs/ItemSingleDeleteDialog.js";
import { ItemMultiCreateDialog } from "../../Components/Dialogs/ItemMultiCreateDialog.js";
import { ItemSingleEditDialog } from "../../Components/Dialogs/ItemSingleEditDialog.js";
import { DataTable } from "../../Components/DataTable.js";
import { doesItemMatchSearchQuery } from "../../Helpers/SearchUtilities.js";
import { AssociationManagementDialog } from "../../Components/Dialogs/AssociationManagementDialog.js";
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

const UserManagement = () => {
    const [usersCombinedState, setUsers, setSelectedUsers, filterUsers] = useItemsReducer();
    const [courses, setCourses] = useState([]);
    const [exhibitions, setExhibitions] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isError, setIsError] = useState(false);
    const [refreshInProgress, setRefreshInProgress] = useState(true);

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

    const clearFilters = () => {
        setSearchQuery("");
        setUserCourseIdFilter(null);
    };

    const [userCourseIdFilter, setUserCourseIdFilter] = useState(null);

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

            setTimeout(() => {
                setRefreshInProgress(false);
            }, 1000);

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

    useEffect(() => {
        filterUsers(userFilterFunction);
    }, [filterUsers, userFilterFunction]);

    return (!appUser.is_admin &&
        <FullPageMessage message="Insufficient Privileges" Icon={LockIcon} buttonText="Return to Profile" buttonDestination="/Account/Profile" />
    ) || (appUser.pw_change_required &&
        <Navigate to="/Account/ChangePassword" />
    ) || (isError &&
        <FullPageMessage message="Error loading users" Icon={WarningIcon} buttonText="Retry" buttonAction={fetchData} />
    ) || (!isLoaded &&
        <FullPageMessage message="Loading users..." Icon={AccessTimeIcon} />
    ) || (
        <ManagementPageProvider
            itemsCombinedState={usersCombinedState}
            managementCallbacks={{
                handleNavigateToChangePassword,
                handleOpenUserPasswordResetDialog,
                handleOpenUserAssignCourseDialog,
                handleOpenViewUserExhibitionDialog,
                handleOpenUserPrivilegesDialog,
                handleChangeUserActivationStatus,
                handleOpenUserEditDialog,
                handleOpenUserDeleteDialog
            }}
            setItems={setUsers}
            setSelectedItems={setSelectedUsers}
        >
            <Box component={Paper} square sx={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gridTemplateRows: "80px calc(100vh - 224px) 80px",
                gridTemplateAreas: `
        "top"
        "table"
        "bottom"
      `
            }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} padding={2} sx={{ gridArea: "top" }}>
                    <SearchBox {...{ searchQuery, setSearchQuery }} placeholder="Search by user name or email" width="30%" />
                    <CourseFilterMenu filterValue={userCourseIdFilter} setFilterValue={setUserCourseIdFilter} {...{ courses }} />
                    <Stack direction="row" spacing={2}>
                        <Button color="primary" variant="outlined" startIcon={<RefreshIcon />} onClick={() => {
                            setRefreshInProgress(true);
                            fetchData();
                        }}
                        disabled={refreshInProgress}>
                            <Typography variant="body1">Refresh</Typography>
                        </Button>
                        <Button color="primary" variant={
                            usersCombinedState.visibleItems.length > 0 ? "outlined" : "contained"
                        } startIcon={<FilterAltOffOutlinedIcon />} onClick={clearFilters}
                        disabled={
                            !(searchQuery || userCourseIdFilter)
                        }>
                            <Typography variant="body1">Clear Filters</Typography>
                        </Button>
                        <Button color="primary" variant="contained" startIcon={<GroupAddIcon />}
                            onClick={() => {
                                setDialogIsOpen(true);
                            }}
                        >
                            <Typography variant="body1">Create Users</Typography>
                        </Button>
                    </Stack>
                </Stack>
                <DataTable
                    items={usersCombinedState.items}
                    tableFields={User.tableFields}
                    rowSelectionEnabled={true}
                    selectedItems={usersCombinedState.selectedItems} setSelectedItems={setSelectedUsers}
                    visibleItems={usersCombinedState.visibleItems}
                    sx={{ gridArea: "table" }}
                    emptyMinHeight="300px"
                    {...
                        (usersCombinedState.visibleItems.length === usersCombinedState.items.length && {
                            noContentMessage: "No users yet",
                            noContentButtonAction: () => { setDialogIsOpen(true); },
                            noContentButtonText: "Create a user",
                            NoContentIcon: InfoIcon
                        }) || (usersCombinedState.visibleItems.length < usersCombinedState.items.length && {
                            noContentMessage: "No results",
                            noContentButtonAction: clearFilters,
                            noContentButtonText: "Clear Filters",
                            NoContentIcon: SearchIcon
                        })
                    }
                />
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} padding={2} sx={{ gridArea: "bottom" }}>
                    <SelectionSummary
                        items={usersCombinedState.items}
                        selectedItems={usersCombinedState.selectedItems}
                        setSelectedItems={setSelectedUsers}
                        visibleItems={usersCombinedState.visibleItems}
                        entitySingular="user"
                        entityPlural="users"
                    />
                    <Stack direction="row" spacing={2} >
                        <Button variant="outlined"
                            sx={{
                                display: usersCombinedState.selectedItems.length === 0 ? "none" : ""
                            }}
                            startIcon={<SchoolIcon />}
                            onClick={() => {
                                setAssociationDialogUsers([...usersCombinedState.selectedItems]);
                                setAssignCourseDialogIsOpen(true);
                            }}>
                            <Typography variant="body1">Manage Course Enrollments for {usersCombinedState.selectedItems.length} {usersCombinedState.selectedItems.length === 1 ? "user" : "users"}</Typography>
                        </Button>
                    </Stack>
                </Stack>

                <ItemMultiCreateDialog
                    Entity={User}
                    refreshAllItems={fetchData}
                    dialogInstructions={"Add users, edit the user fields, then click 'Create'.  You can set passwords after creating the users."}
                    {...{ dialogIsOpen, setDialogIsOpen }} />

                <ItemSingleEditDialog
                    Entity={User}
                    editDialogItem={editDialogUser}
                    refreshAllItems={fetchData}
                    {...{ editDialogIsOpen, setEditDialogIsOpen }} />

                <ItemSingleDeleteDialog
                    Entity={User}
                    allItems={usersCombinedState.items}
                    setAllItems={setUsers}
                    deleteDialogItem={deleteDialogUser}
                    {...{ deleteDialogIsOpen, setDeleteDialogIsOpen }} />

                <AssociationManagementDialog
                    Association={EnrollmentUserPrimary}
                    editMode={true}
                    primaryItems={associationDialogUsers}
                    secondaryItemsAll={courses}
                    refreshAllItems={fetchData}
                    dialogButtonForSecondaryManagement={<>
                        <Button variant="outlined" onClick={() => {
                            navigate("/Account/Admin/Courses");
                        }}>
                            <Typography>Go to course management</Typography>
                        </Button>
                    </>}
                    dialogIsOpen={assignCourseDialogIsOpen}
                    setDialogIsOpen={setAssignCourseDialogIsOpen}
                    secondarySearchFields={["name"]}
                    secondarySearchBoxPlaceholder="Search courses by name"
                />

                <AssociationManagementDialog
                    Association={UserExhibition}
                    editMode={false}
                    primaryItems={associationDialogUsers}
                    secondaryItemsAll={exhibitions}
                    refreshAllItems={fetchData}
                    dialogButtonForSecondaryManagement={<>
                        <Button variant="outlined" onClick={() => {
                            navigate("/Account/Admin/Exhibitions");
                        }}>
                            <Typography>Go to exhibition management</Typography>
                        </Button>
                    </>}
                    dialogIsOpen={viewUserExhibitionDialogIsOpen}
                    setDialogIsOpen={setViewUserExhibitionDialogIsOpen}
                    secondarySearchFields={["title"]}
                    secondarySearchBoxPlaceholder="Search exhibitions by title"
                />

                <UserChangePrivilegesDialog
                    dialogUser={privilegesDialogUser}
                    dialogIsOpen={privilegesDialogIsOpen}
                    setDialogIsOpen={setPrivilegesDialogIsOpen}
                    refreshAllItems={fetchData}
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
