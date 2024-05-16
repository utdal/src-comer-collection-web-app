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
import { User } from "../../Classes/Entities/User.js";
import { EnrollmentCoursePrimary } from "../../Classes/Associations/Enrollment.js";
import { ManagementPageProvider, useItemsReducer } from "../../ContextProviders/ManagementPageProvider.js";

const courseTableFields = [
    {
        columnDescription: "ID",
        TableCellComponent: Course.TableCells.ID,
        generateSortableValue: (course) => course.id
    },
    {
        columnDescription: "Name",
        maxWidth: "200px",
        TableCellComponent: Course.TableCells.Name,
        generateSortableValue: (course) => course.name.toLowerCase()
    },
    {
        columnDescription: "Start",
        TableCellComponent: Course.TableCells.StartDateTimeStacked,
        generateSortableValue: (course) => new Date(course.date_start)
    },
    {
        columnDescription: "End",
        TableCellComponent: Course.TableCells.EndDateTimeStacked,
        generateSortableValue: (course) => new Date(course.date_end)
    },
    {
        columnDescription: "Status",
        TableCellComponent: Course.TableCells.Status
    },
    {
        columnDescription: "Enrollment",
        TableCellComponent: Course.TableCells.UserAssignmentButton
    },
    {
        columnDescription: "Notes",
        TableCellComponent: Course.TableCells.Notes
    },
    {
        columnDescription: "Options",
        TableCellComponent: Course.TableCells.OptionsArray
    }
];

const userTableFieldsForDialog = [
    {
        columnDescription: "ID",
        TableCellComponent: User.TableCells.IDWithAccessIcon,
        generateSortableValue: (user) => user.id
    },
    {
        columnDescription: "User",
        TableCellComponent: User.TableCells.StackedNameEmail,
        generateSortableValue: (user) => user.full_name_reverse?.toLowerCase() ?? ""
    }
];

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

    const handleOpenAssignUserDialog = useCallback((course) => {
        setAssignUserDialogCourses([course]);
        setAssignUserDialogIsOpen(true);
    }, []);

    return (!appUser.is_admin &&
        <FullPageMessage message="Insufficient Privileges" Icon={LockIcon} buttonText="Return to Profile" buttonDestination="/Account/Profile" />
    ) || (appUser.pw_change_required &&
        <Navigate to="/Account/ChangePassword" />
    ) || (isError &&
        <FullPageMessage message="Error loading courses" Icon={WarningIcon} buttonText="Retry" buttonAction={fetchData} />
    ) || (!isLoaded &&
        <FullPageMessage message="Loading courses..." Icon={AccessTimeIcon} />
    ) || (

        <ManagementPageProvider
            itemsCombinedState={coursesCombinedState}
            managementCallbacks={{
                handleOpenCourseDeleteDialog,
                handleOpenCourseEditDialog,
                handleOpenAssignUserDialog
            }}
            setItems={setCourses}
            setSelectedItems={setSelectedCourses}
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
                    <SearchBox {...{ searchQuery, setSearchQuery }} placeholder="Search by course name or notes" width="50%" />
                    <Stack direction="row" spacing={2}>
                        <Button color="primary" variant="outlined" startIcon={<RefreshIcon />} onClick={() => {
                            setRefreshInProgress(true);
                            fetchData();
                        }}
                        disabled={refreshInProgress}>
                            <Typography variant="body1">Refresh</Typography>
                        </Button>
                        <Button color="primary" variant={
                            coursesCombinedState.visibleItems.length > 0 ? "outlined" : "contained"
                        } startIcon={<FilterAltOffOutlinedIcon />} onClick={clearFilters}
                        disabled={
                            !searchQuery
                        }>
                            <Typography variant="body1">Clear Filters</Typography>
                        </Button>
                        <Button color="primary" variant="contained" startIcon={<AddIcon />}
                            onClick={() => {
                                setDialogIsOpen(true);
                            }}
                        >
                            <Typography variant="body1">Create Courses</Typography>
                        </Button>
                    </Stack>
                </Stack>
                <DataTable items={coursesCombinedState.items} visibleItems={coursesCombinedState.visibleItems} tableFields={courseTableFields} rowSelectionEnabled={true}
                    selectedItems={coursesCombinedState.selectedItems} setSelectedItems={setSelectedCourses}
                    {...{ sortColumn, setSortColumn, sortAscending, setSortAscending }}
                    sx={{ gridArea: "table" }}
                    emptyMinHeight="300px"
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
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} padding={2} sx={{ gridArea: "bottom" }}>
                    <SelectionSummary
                        items={coursesCombinedState.items}
                        selectedItems={coursesCombinedState.selectedItems}
                        setSelectedItems={setSelectedCourses}
                        visibleItems={coursesCombinedState.visibleItems}
                        entitySingular="course"
                        entityPlural="courses"
                    />
                    <Stack direction="row" spacing={2} >
                        <Button variant="outlined"
                            disabled={coursesCombinedState.selectedItems.length === 0}
                            startIcon={<GroupAddIcon />}
                            onClick={() => {
                                setAssignUserDialogCourses([...coursesCombinedState.selectedItems]);
                                setAssignUserDialogIsOpen(true);
                            }}>
                            <Typography variant="body1">Manage User Enrollments for {coursesCombinedState.selectedItems.length} {coursesCombinedState.selectedItems.length === 1 ? "course" : "courses"}</Typography>
                        </Button>
                    </Stack>
                </Stack>

                <ItemMultiCreateDialog
                    Entity={Course}
                    refreshAllItems={fetchData}
                    dialogInstructions={"Add courses, edit the course fields, then click 'Create'.  You can enroll users after creating the course."}
                    {...{ dialogIsOpen, setDialogIsOpen }} />

                <ItemSingleEditDialog
                    Entity={Course}
                    editDialogItem={editDialogCourse}
                    refreshAllItems={fetchData}
                    {...{ editDialogIsOpen, setEditDialogIsOpen }} />

                <ItemSingleDeleteDialog
                    Entity={Course}
                    allItems={coursesCombinedState.items}
                    setAllItems={setCourses}
                    deleteDialogItem={deleteDialogCourse}
                    {...{ deleteDialogIsOpen, setDeleteDialogIsOpen }} />

                <AssociationManagementDialog
                    Association={EnrollmentCoursePrimary}
                    editMode={true}
                    primaryEntity="course"
                    secondaryEntity="user"
                    primaryItems={assignUserDialogCourses}
                    secondaryItemsAll={users}
                    secondariesByPrimary={usersByCourse}
                    dialogButtonForSecondaryManagement={<>
                        <Button variant="outlined" onClick={() => {
                            navigate("/Account/Admin/Users");
                        }}>
                            <Typography>Go to user management</Typography>
                        </Button>
                    </>}
                    dialogIsOpen={assignUserDialogIsOpen}
                    setDialogIsOpen={setAssignUserDialogIsOpen}
                    secondaryFieldInPrimary="Users"
                    secondaryTableFields={userTableFieldsForDialog}
                    secondarySearchFields={["given_name"]}
                    secondarySearchBoxPlaceholder={"Search users by name or email"}
                    defaultSortAscending={true}
                    defaultSortColumn="Name"
                    refreshAllItems={fetchData}
                />

            </Box>
        </ManagementPageProvider>
    );
};

export default CourseManagement;
