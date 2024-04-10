import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    Stack,
    Button,
    Typography, Box, Paper
} from "@mui/material";
import { FilterAltOffOutlinedIcon, GroupAddIcon, RefreshIcon, SchoolIcon, SearchIcon, InfoIcon, LockIcon, AccessTimeIcon, WarningIcon } from "../../../Imports/IconImports.js";
import { FullPageMessage } from "../../FullPageMessage.js";
import SearchBox from "../Tools/SearchBox.js";
import { ItemSingleDeleteDialog } from "../../Dialogs/ItemSingleDeleteDialog.js";
import { ItemMultiCreateDialog } from "../../Dialogs/ItemMultiCreateDialog.js";
import { ItemSingleEditDialog } from "../../Dialogs/ItemSingleEditDialog.js";
import { DataTable } from "../Tools/DataTable.js";
import { doesItemMatchSearchQuery } from "../Tools/SearchUtilities.js";
import { AssociationManagementDialog } from "../../Dialogs/AssociationManagementDialog.js";
import { Navigate, useNavigate } from "react-router";
import { UserChangePrivilegesDialog } from "../../Dialogs/UserChangePrivilegesDialog.js";
import { SelectionSummary } from "../Tools/SelectionSummary.js";
import { userFieldDefinitions } from "../Tools/HelperMethods/fields.js";
import { sendAuthenticatedRequest } from "../Tools/HelperMethods/APICalls.js";
import { CourseFilterMenu } from "../../Menus/CourseFilterMenu.js";
import { useSnackbar } from "../../../ContextProviders/AppFeatures.js";
import { useAppUser } from "../../../ContextProviders/AppUser.js";
import { useTitle } from "../../../ContextProviders/AppFeatures.js";
import { UserResetPasswordDialog } from "../../Dialogs/UserResetPasswordDialog.js";
import { useAccountNav } from "../Account.js";
import { User } from "../../../Classes/Entities/User.js";
import { Entity } from "../../../Classes/Entity.js";
import { EnrollmentUserPrimary } from "../../../Classes/Associations/Enrollment.js";
import { UserExhibition } from "../../../Classes/Associations/UserExhibition.js";
import { Exhibition } from "../../../Classes/Entities/Exhibition.js";


const UserManagement = () => {
    const [users, setUsers] = useState([]);
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
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [assignCourseDialogUsers, setAssignCourseDialogUsers] = useState([]);
    const [viewUserExhibitionDialogUsers, setViewUserExhibitionDialogUsers] = useState([]);


    const [coursesByUser, setCoursesByUser] = useState({});
    const [exhibitionsByUser, setExhibitionsByUser] = useState({});

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

    useEffect(() => {
        setSelectedNavItem("User Management");
        setTitleText("User Management");
        if (appUser.is_admin) {
            fetchData();
        }
    }, []);


    const fetchData = async () => {
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
    
    
            const coursesByUserDraft = {};
            for (const c of userData.data) {
                coursesByUserDraft[c.id] = c.Courses;
            }
            setCoursesByUser({ ...coursesByUserDraft });

            const exhibitionsByUserDraft = {};
            for (const e of userData.data) {
                exhibitionsByUserDraft[e.id] = e.Exhibitions;
            }
            setExhibitionsByUser({ ...exhibitionsByUserDraft });

            console.log(coursesByUserDraft);
            console.log(exhibitionsByUserDraft);

            setIsLoaded(true);
        }
        catch(e) {
            setIsError(true);
        }
    };



    const userFilterFunction = useCallback((user) => {
        return (
            !userCourseIdFilter || userCourseIdFilter && user.Courses.map((c) => c.id).includes(userCourseIdFilter.id)
        ) && (
            doesItemMatchSearchQuery(searchQuery, user, ["full_name", "full_name_reverse", "email_without_domain"])
        );
    }, [userCourseIdFilter, searchQuery]);


    const handleCopyToClipboard = useCallback((user, fieldName) => {
        try {
            navigator.clipboard.writeText(user[fieldName]);
            if (fieldName == "email") {
                showSnackbar(`Email address for user ${user.id} copied to clipboard`, "success");
            } else {
                showSnackbar("Text copied to clipboard", "success");
            }

        } catch (error) {
            showSnackbar("Error copying text to clipboard", "error");
        }
    }, []);


    const userTableFields = [
        {
            columnDescription: "ID",
            generateTableCell: (user) => (
                <User.TableCells.ID {...{user}} />
            ),
            generateSortableValue: (user) => user.id
        },
        {
            columnDescription: "Name",
            maxWidth: "150px",
            generateTableCell: (user) => (
                <User.TableCells.Name {...{user}} />
            ),
            generateSortableValue: (user) => user.full_name_reverse.toLowerCase()
        },
        {
            columnDescription: "Email",
            generateTableCell: (user) => (
                <User.TableCells.Email {...{user}} onClick={() => { 
                    handleCopyToClipboard(user, "email");
                }} />
            ),
            generateSortableValue: (user) => user.email
        },
        {
            columnDescription: "Password",
            generateTableCell: (user) => (
                <>
                    {appUser.id == user.id ? (
                        <User.TableCells.PasswordChangeCurrentAdmin {...{user}} onClick={() => {
                            navigate("/Account/ChangePassword");
                        }} />
                    ) : (
                        <User.TableCells.PasswordSetOrReset {...{user}} onClick={() => {
                            setResetPasswordDialogUser(user);
                            setResetPasswordDialogIsOpen(true);
                        }} />
                    )}
                </>
            )
        },
        {
            columnDescription: "Courses",
            generateTableCell: (user) => (
                <User.TableCells.CourseAssignmentButton {...{user}} onClick={() => {
                    setAssignCourseDialogUsers([user]);
                    setAssignCourseDialogIsOpen(true);
                }} />
            )
        },
        {
            columnDescription: "Exhibitions",
            generateTableCell: (user) => (
                <User.TableCells.UserExhibitionCountButton {...{user}} onClick={() => {
                    setViewUserExhibitionDialogUsers([user]);
                    setViewUserExhibitionDialogIsOpen(true);
                }} />
            )
        },
        {
            columnDescription: "User Type",
            generateTableCell: (user) => (
                <User.TableCells.UserTypeButton {...{user}} onClick={() => {
                    setPrivilegesDialogUser(user);
                    setPrivilegesDialogIsOpen(true);
                }} />
            )
        },
        {
            columnDescription: "Active",
            generateTableCell: (user) => (
                <User.TableCells.UserActivationSwitch {...{user}} onClick={(e) => {
                    User.handleChangeUserActivationStatus(user.id, e.target.checked).then((msg) => {
                        fetchData();
                        showSnackbar(msg, "success");
                    }).catch((err) => {
                        showSnackbar(err, "error");
                    });
                }} />
            )
        },
        {
            columnDescription: "Options",
            generateTableCell: (user) => (
                <Stack direction="row">
                    <Entity.TableCells.EditButton onClick={() => {
                        setEditDialogUser(user);
                        setEditDialogIsOpen(true);
                    }} />
                    <User.TableCells.DeleteButton {...{user}}
                        onClick={() => {
                            setDeleteDialogUser(user);
                            setDeleteDialogIsOpen(true);
                        }} />
                </Stack>
            )
        }
    ];

    const exhibitionTableFieldsForDialog = [
        {
            columnDescription: "ID",
            generateTableCell: (exhibition) => (
                <Exhibition.TableCells.ID {...{exhibition}} />
            )
        },
        {
            columnDescription: "Title",
            generateTableCell: (exhibition) => (
                <Exhibition.TableCells.Title {...{exhibition}} />
            )
        },
        {
            columnDescription: "Open",
            generateTableCell: (exhibition) => (
                <Exhibition.TableCells.OpenInNewTab {...{exhibition}} />
            )
        },
        {
            columnDescription: "Created",
            generateTableCell: (exhibition) => (
                <Exhibition.TableCells.DateCreatedStacked {...{exhibition}} />
            )
        },
        {
            columnDescription: "Modified",
            generateTableCell: (exhibition) => (
                <Exhibition.TableCells.DateModifiedStacked {...{exhibition}} />
            )
        },
        {
            columnDescription: "Access",
            generateTableCell: (exhibition) => (
                <Exhibition.TableCells.Access {...{exhibition}} />
            )
        }
    ];

    const courseTableFieldsForDialog = [
        {
            columnDescription: "ID",
            generateTableCell: (course) => (
                <Typography variant="body1">{course.id}</Typography>
            ),
            generateSortableValue: (course) => course.id
        },
        {
            columnDescription: "Name",
            maxWidth: "200px",
            generateTableCell: (course) => (
                <Typography variant="body1">{course.name}</Typography>
            ),
            generateSortableValue: (course) => course.name
        },
        {
            columnDescription: "Dates",
            generateTableCell: (course) => (
                <Stack>
                    <Typography variant="body1">{new Date(course.date_start).toLocaleDateString()}</Typography>
                    <Typography variant="body1">{new Date(course.date_end).toLocaleDateString()}</Typography>
                </Stack>
            )
        }
    ];

    const visibleUsers = useMemo(() => users.filter((user) => {
        return userFilterFunction(user);
    }), [users, searchQuery, userCourseIdFilter]);



    return !appUser.is_admin && (
        <FullPageMessage message="Insufficient Privileges" Icon={LockIcon} buttonText="Return to Profile" buttonDestination="/Account/Profile" />
    ) || appUser.pw_change_required && (
        <Navigate to="/Account/ChangePassword" />
    ) || isError && (
        <FullPageMessage message="Error loading users" Icon={WarningIcon} buttonText="Retry" buttonAction={fetchData} />
    ) || !isLoaded && (
        <FullPageMessage message="Loading users..." Icon={AccessTimeIcon} />
    ) || (
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
                        visibleUsers.length > 0 ? "outlined" : "contained"
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
            <DataTable items={users} tableFields={userTableFields}
                rowSelectionEnabled={true}
                selectedItems={selectedUsers} setSelectedItems={setSelectedUsers}
                visibleItems={visibleUsers}
                sx={{ gridArea: "table" }}
                emptyMinHeight="300px"
                {...visibleUsers.length == users.length && {
                    noContentMessage: "No users yet",
                    noContentButtonAction: () => { setDialogIsOpen(true); },
                    noContentButtonText: "Create a user",
                    NoContentIcon: InfoIcon
                } || visibleUsers.length < users.length && {
                    noContentMessage: "No results",
                    noContentButtonAction: clearFilters,
                    noContentButtonText: "Clear Filters",
                    NoContentIcon: SearchIcon
                }}
            />
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} padding={2} sx={{ gridArea: "bottom" }}>
                <SelectionSummary
                    items={users}
                    selectedItems={selectedUsers}
                    setSelectedItems={setSelectedUsers}
                    visibleItems={visibleUsers}
                    entitySingular="user"
                    entityPlural="users"
                />
                <Stack direction="row" spacing={2} >
                    <Button variant="outlined"
                        sx={{
                            display: selectedUsers.length == 0 ? "none" : ""
                        }}
                        startIcon={<SchoolIcon />}
                        onClick={() => {
                            setAssignCourseDialogUsers([...selectedUsers]);
                            setAssignCourseDialogIsOpen(true);
                        }}>
                        <Typography variant="body1">Manage Course Enrollments for {selectedUsers.length} {selectedUsers.length == 1 ? "user" : "users"}</Typography>
                    </Button>
                </Stack>
            </Stack>

            <ItemMultiCreateDialog
                Entity={User}
                allItems={users}
                refreshAllItems={fetchData}
                dialogInstructions={"Add users, edit the user fields, then click 'Create'.  You can set passwords after creating the users."}
                createDialogFieldDefinitions={userFieldDefinitions}
                {...{ dialogIsOpen, setDialogIsOpen }} />

            <ItemSingleEditDialog
                Entity={User}
                editDialogItem={editDialogUser}
                refreshAllItems={fetchData}
                {...{ editDialogFieldDefinitions: userFieldDefinitions, editDialogIsOpen, setEditDialogIsOpen }} />

            <ItemSingleDeleteDialog
                Entity={User}
                allItems={users}
                setAllItems={setUsers}
                deleteDialogItem={deleteDialogUser}
                {...{ deleteDialogIsOpen, setDeleteDialogIsOpen }} />

            <AssociationManagementDialog
                Association={EnrollmentUserPrimary}
                editMode={true}
                primaryItems={assignCourseDialogUsers}
                secondaryItemsAll={courses}
                secondariesByPrimary={coursesByUser}
                refreshAllItems={fetchData}
                dialogButtonForSecondaryManagement={<>
                    <Button variant="outlined" onClick={() => {
                        navigate("/Account/CourseManagement");
                    }}>
                        <Typography>Go to course management</Typography>
                    </Button>
                </>}
                dialogIsOpen={assignCourseDialogIsOpen}
                setDialogIsOpen={setAssignCourseDialogIsOpen}
                secondaryTableFields={courseTableFieldsForDialog}
                secondarySearchFields={["name"]}
                secondarySearchBoxPlaceholder="Search courses by name"
            />

            <AssociationManagementDialog
                Association={UserExhibition}
                editMode={false}
                primaryItems={viewUserExhibitionDialogUsers}
                secondaryItemsAll={exhibitions}
                secondariesByPrimary={exhibitionsByUser}
                refreshAllItems={fetchData}
                dialogButtonForSecondaryManagement={<>
                    <Button variant="outlined" onClick={() => {
                        navigate("/Account/ExhibitionManagement");
                    }}>
                        <Typography>Go to exhibition management</Typography>
                    </Button>
                </>}
                dialogIsOpen={viewUserExhibitionDialogIsOpen}
                setDialogIsOpen={setViewUserExhibitionDialogIsOpen}
                secondaryTableFields={exhibitionTableFieldsForDialog}
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
    );
};


export default UserManagement;
