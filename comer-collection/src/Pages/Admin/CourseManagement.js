import React, { useCallback, useEffect, useState } from "react";
import {
    Stack,
    Button,
    Typography, Box, Paper
} from "@mui/material";
import { FullPageMessage } from "../../Components/FullPageMessage.js";
import SearchBox from "../../Components/SearchBox.js";
import { ItemSingleDeleteDialog } from "../../Components/Dialogs/ItemSingleDeleteDialog.js";
import { ItemMultiCreateDialog } from "../../Components/Dialogs/ItemMultiCreateDialog.js";
import { ItemSingleEditDialog } from "../../Components/Dialogs/ItemSingleEditDialog.js";
import { DataTable } from "../../Components/DataTable/DataTable.js";
import { doesItemMatchSearchQuery } from "../../Helpers/SearchUtilities.js";
import { AssociationManagementDialog } from "../../Components/Dialogs/AssociationManagementDialog/AssociationManagementDialog.js";
import { Navigate, useNavigate } from "react-router";
import { SelectionSummary } from "../../Components/SelectionSummary.js";
import { sendAuthenticatedRequest } from "../../Helpers/APICalls.js";
import { useAppUser } from "../../ContextProviders/AppUser.js";
import {
    AddIcon, RefreshIcon, GroupAddIcon, AccessTimeIcon,
    WarningIcon,
    LockIcon
} from "../../Imports/Icons.js";
import { useTitle } from "../../ContextProviders/AppFeatures.js";
import { useAccountNav } from "../../ContextProviders/AccountNavProvider.js";
import { Course } from "../../Classes/Entities/Course.js";
import { EnrollmentCoursePrimary } from "../../Classes/Associations/Enrollment.js";
import { ManagementPageProvider, useItemsReducer } from "../../ContextProviders/ManagementPageProvider.js";
import { ClearFilterButton } from "../../Components/Buttons/ClearFilterButton.js";

const CourseManagement = () => {
    const [coursesCombinedState, setCourses, setSelectedCourses, filterCourses] = useItemsReducer(Course);
    const [users, setUsers] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isError, setIsError] = useState(false);
    const [refreshInProgress, setRefreshInProgress] = useState(true);

    const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false);
    const [deleteDialogCourse, setDeleteDialogCourse] = useState(null);

    const [editDialogIsOpen, setEditDialogIsOpen] = useState(false);
    const [editDialogCourse, setEditDialogCourse] = useState(null);

    const [assignUserDialogIsOpen, setAssignUserDialogIsOpen] = useState(false);
    const [assignUserDialogCourses, setAssignUserDialogCourses] = useState([]);

    const [dialogIsOpen, setDialogIsOpen] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");

    const handleClearFilters = useCallback(() => {
        setSearchQuery("");
    }, []);

    const [, setSelectedNavItem] = useAccountNav();
    const [appUser] = useAppUser();
    const navigate = useNavigate();
    const setTitleText = useTitle();

    const fetchData = useCallback(async () => {
        try {
            setIsError(false);
            const courseData = await sendAuthenticatedRequest("GET", "/api/admin/courses");
            setCourses(courseData.data);

            const userData = await sendAuthenticatedRequest("GET", "/api/admin/users");
            setUsers(userData.data);

            setTimeout(() => {
                setRefreshInProgress(false);
            }, 1000);

            setIsLoaded(true);
        } catch (error) {
            setIsError(true);
        }
    }, [setCourses]);

    useEffect(() => {
        setSelectedNavItem("Course Management");
        setTitleText("Course Management");
        if (appUser.is_admin) {
            fetchData();
        }
    }, [appUser.is_admin, setSelectedNavItem, setTitleText, fetchData]);

    const courseFilterFunction = useCallback((course) => {
        return doesItemMatchSearchQuery(searchQuery, course, ["name", "notes"]);
    }, [searchQuery]);

    useEffect(() => {
        filterCourses(courseFilterFunction);
    }, [filterCourses, courseFilterFunction]);

    const handleOpenCourseEditDialog = useCallback((course) => {
        setEditDialogCourse(course);
        setEditDialogIsOpen(true);
    }, []);

    const handleOpenCourseDeleteDialog = useCallback((course) => {
        setDeleteDialogCourse(course);
        setDeleteDialogIsOpen(true);
    }, []);

    const handleOpenAssignCourseUserDialog = useCallback((course) => {
        setAssignUserDialogCourses([course]);
        setAssignUserDialogIsOpen(true);
    }, []);

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
            message="Error loading courses"
        />
    ) || (!isLoaded &&
        <FullPageMessage
            Icon={AccessTimeIcon}
            message="Loading courses..."
        />
    ) || (

        <ManagementPageProvider
            Entity={Course}
            itemsCombinedState={coursesCombinedState}
            managementCallbacks={{
                handleOpenCourseDeleteDialog,
                handleOpenCourseEditDialog,
                handleOpenAssignCourseUserDialog,
                handleClearFilters
            }}
            setItems={setCourses}
            setSelectedItems={setSelectedCourses}
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
                        placeholder="Search by course name or notes"
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        width="50%"
                    />

                    <Stack
                        direction="row"
                        spacing={2}
                    >
                        <Button
                            color="primary"
                            disabled={refreshInProgress}
                            onClick={() => {
                                setRefreshInProgress(true);
                                fetchData();
                            }}
                            startIcon={<RefreshIcon />}
                            variant="outlined"
                        >
                            <Typography variant="body1">
                                Refresh
                            </Typography>
                        </Button>

                        <ClearFilterButton />

                        <Button
                            color="primary"
                            onClick={() => {
                                setDialogIsOpen(true);
                            }}
                            startIcon={<AddIcon />}
                            variant="contained"
                        >
                            <Typography variant="body1">
                                Create Courses
                            </Typography>
                        </Button>
                    </Stack>
                </Stack>

                <DataTable
                    defaultSortAscending
                    defaultSortColumn="ID"
                    emptyMinHeight="300px"
                    rowSelectionEnabled
                    sx={{ gridArea: "table" }}
                    tableFields={Course.tableFields}
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
                            disabled={coursesCombinedState.selectedItems.length === 0}
                            onClick={() => {
                                setAssignUserDialogCourses([...coursesCombinedState.selectedItems]);
                                setAssignUserDialogIsOpen(true);
                            }}
                            startIcon={<GroupAddIcon />}
                            variant="outlined"
                        >
                            <Typography variant="body1">
                                Manage User Enrollments for
                                {coursesCombinedState.selectedItems.length}

                                {" "}

                                {coursesCombinedState.selectedItems.length === 1 ? "course" : "courses"}
                            </Typography>
                        </Button>
                    </Stack>
                </Stack>

                <ItemMultiCreateDialog
                    Entity={Course}
                    dialogInstructions={"Add courses, edit the course fields, then click 'Create'.  You can enroll users after creating the course."}
                    dialogIsOpen={dialogIsOpen}
                    refreshAllItems={fetchData}
                    setDialogIsOpen={setDialogIsOpen}
                />

                <ItemSingleEditDialog
                    Entity={Course}
                    editDialogIsOpen={editDialogIsOpen}
                    editDialogItem={editDialogCourse}
                    refreshAllItems={fetchData}
                    setEditDialogIsOpen={setEditDialogIsOpen}
                />

                <ItemSingleDeleteDialog
                    Entity={Course}
                    allItems={coursesCombinedState.items}
                    deleteDialogIsOpen={deleteDialogIsOpen}
                    deleteDialogItem={deleteDialogCourse}
                    setAllItems={setCourses}
                    setDeleteDialogIsOpen={setDeleteDialogIsOpen}
                />

                <AssociationManagementDialog
                    Association={EnrollmentCoursePrimary}
                    defaultSortAscending
                    defaultSortColumn="Name"
                    dialogButtonForSecondaryManagement={
                        <Button
                            onClick={() => {
                                navigate("/Account/Admin/Users");
                            }}
                            variant="outlined"
                        >
                            <Typography>
                                Go to user management
                            </Typography>
                        </Button>
                    }
                    dialogIsOpen={assignUserDialogIsOpen}
                    editMode
                    primaryItems={assignUserDialogCourses}
                    refreshAllItems={fetchData}
                    secondaryItemsAll={users}
                    secondarySearchBoxPlaceholder="Search users by name or email"
                    secondarySearchFields={["given_name"]}
                    setDialogIsOpen={setAssignUserDialogIsOpen}
                />

            </Box>
        </ManagementPageProvider>
    );
};

export default CourseManagement;
