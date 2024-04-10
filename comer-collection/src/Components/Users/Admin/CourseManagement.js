import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    Stack,
    Button,
    Typography, Box, Paper
} from "@mui/material";
import { FullPageMessage } from "../../FullPageMessage.js";
import SearchBox from "../Tools/SearchBox.js";
import { ItemSingleDeleteDialog } from "../../Dialogs/ItemSingleDeleteDialog.js";
import { ItemMultiCreateDialog } from "../../Dialogs/ItemMultiCreateDialog.js";
import { ItemSingleEditDialog } from "../../Dialogs/ItemSingleEditDialog.js";
import { DataTable } from "../../DataTable.js";
import { doesItemMatchSearchQuery } from "../Tools/SearchUtilities.js";
import { AssociationManagementDialog } from "../../Dialogs/AssociationManagementDialog.js";
import { Navigate, useNavigate } from "react-router";
import { SelectionSummary } from "../Tools/SelectionSummary.js";
import { courseFieldDefinitions } from "../Tools/HelperMethods/fields.js";
import { sendAuthenticatedRequest } from "../Tools/HelperMethods/APICalls.js";
import { useAppUser } from "../../../ContextProviders/AppUser.js";
import {
    FilterAltOffOutlinedIcon,
    AddIcon,
    SearchIcon,
    RefreshIcon, GroupAddIcon, InfoIcon,
    AccessTimeIcon,
    WarningIcon,
    LockIcon
} from "../../../Imports/IconImports.js";
import { useTitle } from "../../../ContextProviders/AppFeatures.js";
import { useAccountNav } from "../Account.js";
import { Course } from "../../../Classes/Entities/Course.js";
import { User } from "../../../Classes/Entities/User.js";
import { EnrollmentCoursePrimary } from "../../../Classes/Associations/Enrollment.js";


const CourseManagement = () => {
    const [courses, setCourses] = useState([]);
    const [users, setUsers] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isError, setIsError] = useState(false);
    const [refreshInProgress, setRefreshInProgress] = useState(true);

    const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false);
    const [deleteDialogCourse, setDeleteDialogCourse] = useState(null);

    const [editDialogIsOpen, setEditDialogIsOpen] = useState(false);
    const [editDialogCourse, setEditDialogCourse] = useState(null);

    const [assignUserDialogIsOpen, setAssignUserDialogIsOpen] = useState(false);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [assignUserDialogCourses, setAssignUserDialogCourses] = useState([]);

    const [usersByCourse, setUsersByCourse] = useState({});

    const editDialogFieldDefinitions = courseFieldDefinitions;
    const createDialogFieldDefinitions = courseFieldDefinitions;

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


    useEffect(() => {
        setSelectedNavItem("Course Management");
        setTitleText("Course Management");
        if (appUser.is_admin) {
            fetchData();
        }
    }, []);


    const courseFilterFunction = useCallback((course) => {
        return doesItemMatchSearchQuery(searchQuery, course, ["name", "notes"]);
    }, [searchQuery]);


    const fetchData = async () => {
        try {
            setIsError(false);
            const courseData = await sendAuthenticatedRequest("GET", "/api/admin/courses");
            setCourses(courseData.data);

            setSelectedCourses(selectedCourses.filter((sc) => (
                courseData.data.map((c) => c.id).includes(parseInt(sc.id))
            )));


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
    };


    const visibleCourses = useMemo(() => courses.filter((course) => {
        return courseFilterFunction(course);
    }), [courses, searchQuery]);



    const courseTableFields = [
        {
            columnDescription: "ID",
            generateTableCell: (course) => (
                <Course.TableCells.ID {...{course}} />
            ),
            generateSortableValue: (course) => course.id
        },
        {
            columnDescription: "Name",
            maxWidth: "200px",
            generateTableCell: (course) => (
                <Typography variant="body1">{course.name}</Typography>
            ),
            generateSortableValue: (course) => course.name.toLowerCase()
        },
        {
            columnDescription: "Start",
            generateTableCell: (course) => (
                <Course.TableCells.StartDateTimeStacked {...{course}} />
            ),
            generateSortableValue: (course) => new Date(course.date_start)
        },
        {
            columnDescription: "End",
            generateTableCell: (course) => (
                <Course.TableCells.EndDateTimeStacked {...{course}} />
            ),
            generateSortableValue: (course) => new Date(course.date_end)
        },
        {
            columnDescription: "Status",
            generateTableCell: (course) => (
                <Course.TableCells.Status {...{course}} />
            )
        },
        {
            columnDescription: "Enrollment",
            generateTableCell: (course) => (
                <Course.TableCells.UserAssignmentButton {...{course}} onClick={() => {
                    setAssignUserDialogCourses([course]);
                    setAssignUserDialogIsOpen(true);
                }} />
            )
        },
        {
            columnDescription: "Notes",
            generateTableCell: (course) => (
                <Course.TableCells.Notes {...{course}} />
            )
        },
        {
            columnDescription: "Options",
            generateTableCell: (course) => (
                <>
                    <Course.TableCells.EditButton 
                        onClick={() => {
                            setEditDialogCourse(course);
                            setEditDialogIsOpen(true);
                        }} />
                    <Course.TableCells.DeleteButton {...{course}}
                        onClick={() => {
                            setDeleteDialogCourse(course);
                            setDeleteDialogIsOpen(true);
                        }} />
                </>
            )
        }
    ];


    const userTableFieldsForDialog = [
        {
            columnDescription: "ID",
            generateTableCell: (user) => (
                <User.TableCells.IDWithAccessIcon {...{user}} />
            ),
            generateSortableValue: (user) => user.id
        },
        {
            columnDescription: "User",
            generateTableCell: (user) => (
                <User.TableCells.StackedNameEmail {...{user}} />
            ),
            generateSortableValue: (user) => user.full_name_reverse?.toLowerCase() ?? ""
        }
    ];



    return !appUser.is_admin && (
        <FullPageMessage message="Insufficient Privileges" Icon={LockIcon} buttonText="Return to Profile" buttonDestination="/Account/Profile" />
    ) || appUser.pw_change_required && (
        <Navigate to="/Account/ChangePassword" />
    ) || isError && (
        <FullPageMessage message="Error loading courses" Icon={WarningIcon} buttonText="Retry" buttonAction={fetchData} />
    ) || !isLoaded && (
        <FullPageMessage message="Loading courses..." Icon={AccessTimeIcon} />
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
                        visibleCourses.length > 0 ? "outlined" : "contained"
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
            <DataTable items={courses} visibleItems={visibleCourses} tableFields={courseTableFields} rowSelectionEnabled={true}
                selectedItems={selectedCourses} setSelectedItems={setSelectedCourses}
                {...{ sortColumn, setSortColumn, sortAscending, setSortAscending }}
                sx={{ gridArea: "table" }}
                emptyMinHeight="300px"
                {...visibleCourses.length == courses.length && {
                    noContentMessage: "No courses yet",
                    noContentButtonAction: () => { setDialogIsOpen(true); },
                    noContentButtonText: "Create a course",
                    NoContentIcon: InfoIcon
                } || visibleCourses.length < courses.length && {
                    noContentMessage: "No results",
                    noContentButtonAction: clearFilters,
                    noContentButtonText: "Clear Filters",
                    NoContentIcon: SearchIcon
                }}
            />
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} padding={2} sx={{ gridArea: "bottom" }}>
                <SelectionSummary
                    items={courses}
                    selectedItems={selectedCourses}
                    setSelectedItems={setSelectedCourses}
                    visibleItems={visibleCourses}
                    entitySingular="course"
                    entityPlural="courses"
                />
                <Stack direction="row" spacing={2} >
                    <Button variant="outlined"
                        disabled={selectedCourses.length == 0}
                        startIcon={<GroupAddIcon />}
                        onClick={() => {
                            setAssignUserDialogCourses([...selectedCourses]);
                            setAssignUserDialogIsOpen(true);
                        }}>
                        <Typography variant="body1">Manage User Enrollments for {selectedCourses.length} {selectedCourses.length == 1 ? "course" : "courses"}</Typography>
                    </Button>
                </Stack>
            </Stack>

            <ItemMultiCreateDialog
                Entity={Course}
                refreshAllItems={fetchData}
                dialogInstructions={"Add courses, edit the course fields, then click 'Create'.  You can enroll users after creating the course."}
                {...{ createDialogFieldDefinitions, dialogIsOpen, setDialogIsOpen }} />

            <ItemSingleEditDialog
                Entity={Course}
                editDialogItem={editDialogCourse}
                refreshAllItems={fetchData}
                {...{ editDialogFieldDefinitions, editDialogIsOpen, setEditDialogIsOpen }} />

            <ItemSingleDeleteDialog
                Entity={Course}
                allItems={courses}
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
                        navigate("/Account/UserManagement");
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
    );
};


export default CourseManagement;
