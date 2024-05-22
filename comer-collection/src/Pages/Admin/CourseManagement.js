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
    GroupAddIcon, AccessTimeIcon,
    WarningIcon,
    LockIcon
} from "../../Imports/Icons.js";
import { useTitle } from "../../ContextProviders/AppFeatures.js";
import { useAccountNavTitle } from "../../ContextProviders/AccountNavProvider.js";
import { Course } from "../../Classes/Entities/Course.js";
import { EnrollmentCoursePrimary } from "../../Classes/Associations/Enrollment.js";
import { ManagementPageProvider, useItemsReducer } from "../../ContextProviders/ManagementPageProvider.js";
import { ClearFilterButton } from "../../Components/Buttons/ClearFilterButton.js";
import { RefreshButton } from "../../Components/Buttons/RefreshButton.js";
import { MultiCreateButton } from "../../Components/Buttons/MultiCreateButton.js";
import { ManagementButtonStack } from "../../Components/ManagementPage/ManagementButtonStack.js";

const CourseManagement = () => {
    const [coursesCombinedState, setCourses, setSelectedCourses, filterCourses] = useItemsReducer(Course);
    const [users, setUsers] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isError, setIsError] = useState(false);

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

    const [appUser] = useAppUser();
    const navigate = useNavigate();
    const setTitleText = useTitle();

    useAccountNavTitle("Course Management");

    const handleRefresh = useCallback(async () => {
        try {
            setIsError(false);
            const courseData = await sendAuthenticatedRequest("GET", "/api/admin/courses");
            setCourses(courseData.data);

            const userData = await sendAuthenticatedRequest("GET", "/api/admin/users");
            setUsers(userData.data);

            setIsLoaded(true);
        } catch (error) {
            setIsError(true);
        }
    }, [setCourses]);

    useEffect(() => {
        setTitleText("Course Management");
        if (appUser.is_admin) {
            handleRefresh();
        }
    }, [appUser.is_admin, setTitleText, handleRefresh]);

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
            buttonAction={handleRefresh}
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
                handleClearFilters,
                handleRefresh
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

                    <ManagementButtonStack>
                        <RefreshButton />

                        <ClearFilterButton />

                        <MultiCreateButton />
                    </ManagementButtonStack>
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

                    <ManagementButtonStack>
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
                    </ManagementButtonStack>
                </Stack>

            </Box>

            <ItemMultiCreateDialog
                Entity={Course}
                dialogInstructions={"Add courses, edit the course fields, then click 'Create'.  You can enroll users after creating the course."}
                dialogIsOpen={dialogIsOpen}
                refreshAllItems={handleRefresh}
                setDialogIsOpen={setDialogIsOpen}
            />

            <ItemSingleEditDialog
                Entity={Course}
                editDialogIsOpen={editDialogIsOpen}
                editDialogItem={editDialogCourse}
                refreshAllItems={handleRefresh}
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
                refreshAllItems={handleRefresh}
                secondaryItemsAll={users}
                secondarySearchBoxPlaceholder="Search users by name or email"
                secondarySearchFields={["given_name"]}
                setDialogIsOpen={setAssignUserDialogIsOpen}
            />
        </ManagementPageProvider>
    );
};

export default CourseManagement;
