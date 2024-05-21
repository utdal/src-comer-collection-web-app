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
import { DataTable } from "../../Components/DataTable.js";
import { doesItemMatchSearchQuery } from "../../Helpers/SearchUtilities.js";
import { AssociationManagementDialog } from "../../Components/Dialogs/AssociationManagementDialog.js";
import { Navigate, useNavigate } from "react-router";
import { SelectionSummary } from "../../Components/SelectionSummary.js";
import { sendAuthenticatedRequest } from "../../Helpers/APICalls.js";
import { useAppUser } from "../../ContextProviders/AppUser.js";
import {
    FilterAltOffOutlinedIcon,
    AddIcon,
    SearchIcon,
    RefreshIcon, GroupAddIcon, InfoIcon,
    AccessTimeIcon,
    WarningIcon,
    LockIcon
} from "../../Imports/Icons.js";
import { useTitle } from "../../ContextProviders/AppFeatures.js";
import { useAccountNav } from "../../ContextProviders/AccountNavProvider.js";
import { Course } from "../../Classes/Entities/Course.js";
import { EnrollmentCoursePrimary } from "../../Classes/Associations/Enrollment.js";
import { ManagementPageProvider, useItemsReducer } from "../../ContextProviders/ManagementPageProvider.js";

const CourseManagement = () => {
    const [coursesCombinedState, setCourses, setSelectedCourses, filterCourses] = useItemsReducer();
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

    const [usersByCourse, setUsersByCourse] = useState({});

    const [dialogIsOpen, setDialogIsOpen] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");

    const clearFilters = () => {
        setSearchQuery("");
    };

    const [sortColumn, setSortColumn] = useState("ID");
    const [sortAscending, setSortAscending] = useState(true);

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

            const usersByCourseDraft = {};
            for (const c of courseData.data) {
                usersByCourseDraft[c.id] = c.Users;
            }
            setUsersByCourse({ ...usersByCourseDraft });
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
            itemsCombinedState={coursesCombinedState}
            managementCallbacks={{
                handleOpenCourseDeleteDialog,
                handleOpenCourseEditDialog,
                handleOpenAssignCourseUserDialog
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
                        {...{ searchQuery, setSearchQuery }}
                        placeholder="Search by course name or notes"
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

                        <Button
                            color="primary"
                            disabled={
                                !searchQuery
                            }
                            onClick={clearFilters}
                            startIcon={<FilterAltOffOutlinedIcon />}
                            variant={
                                coursesCombinedState.visibleItems.length > 0 ? "outlined" : "contained"
                            }
                        >
                            <Typography variant="body1">
                                Clear Filters
                            </Typography>
                        </Button>

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
                    items={coursesCombinedState.items}
                    rowSelectionEnabled
                    selectedItems={coursesCombinedState.selectedItems}
                    setSelectedItems={setSelectedCourses}
                    tableFields={Course.tableFields}
                    visibleItems={coursesCombinedState.visibleItems}
                    {...{ sortColumn, setSortColumn, sortAscending, setSortAscending }}
                    emptyMinHeight="300px"
                    sx={{ gridArea: "table" }}
                    {...
                        (coursesCombinedState.visibleItems.length === coursesCombinedState.items.length && {
                            noContentMessage: "No courses yet",
                            noContentButtonAction: () => { setDialogIsOpen(true); },
                            noContentButtonText: "Create a course",
                            NoContentIcon: InfoIcon
                        }) || (coursesCombinedState.visibleItems.length < coursesCombinedState.items.length && {
                            noContentMessage: "No results",
                            noContentButtonAction: clearFilters,
                            noContentButtonText: "Clear Filters",
                            NoContentIcon: SearchIcon
                        })
                    }
                />

                <Stack
                    alignItems="center"
                    direction="row"
                    justifyContent="space-between"
                    padding={2}
                    spacing={2}
                    sx={{ gridArea: "bottom" }}
                >
                    <SelectionSummary
                        entityPlural="courses"
                        entitySingular="course"
                        items={coursesCombinedState.items}
                        selectedItems={coursesCombinedState.selectedItems}
                        setSelectedItems={setSelectedCourses}
                        visibleItems={coursesCombinedState.visibleItems}
                    />

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
                    refreshAllItems={fetchData}
                    {...{ dialogIsOpen, setDialogIsOpen }}
                />

                <ItemSingleEditDialog
                    Entity={Course}
                    editDialogItem={editDialogCourse}
                    refreshAllItems={fetchData}
                    {...{ editDialogIsOpen, setEditDialogIsOpen }}
                />

                <ItemSingleDeleteDialog
                    Entity={Course}
                    allItems={coursesCombinedState.items}
                    deleteDialogItem={deleteDialogCourse}
                    setAllItems={setCourses}
                    {...{ deleteDialogIsOpen, setDeleteDialogIsOpen }}
                />

                <AssociationManagementDialog
                    Association={EnrollmentCoursePrimary}
                    defaultSortAscending
                    defaultSortColumn="Name"
                    dialogButtonForSecondaryManagement={<Button
                        onClick={() => {
                            navigate("/Account/Admin/Users");
                        }}
                        variant="outlined"
                    >
                        <Typography>
                            Go to user management
                        </Typography>
                    </Button>}
                    dialogIsOpen={assignUserDialogIsOpen}
                    editMode
                    primaryItems={assignUserDialogCourses}
                    refreshAllItems={fetchData}
                    secondariesByPrimary={usersByCourse}
                    secondaryFieldInPrimary="Users"
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
