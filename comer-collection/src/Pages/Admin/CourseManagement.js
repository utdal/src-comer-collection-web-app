import React, { useCallback, useEffect, useState } from "react";
import {
    Button,
    Typography
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
import { useAppUser } from "../../ContextProviders/AppUser.js";
import {
    GroupAddIcon, AccessTimeIcon,
    WarningIcon,
    LockIcon
} from "../../Imports/Icons.js";
import { useTitle } from "../../ContextProviders/AppFeatures.js";
import { useAccountNavTitle } from "../../Hooks/useAccountNavTitle.js";
import { Course } from "../../Classes/Entities/Course.js";
import { EnrollmentCoursePrimary } from "../../Classes/Associations/Enrollment.js";
import { ManagementPageProvider, useItemsReducer } from "../../ContextProviders/ManagementPageProvider.js";
import { ClearFilterButton } from "../../Components/Buttons/ClearFilterButton.js";
import { RefreshButton } from "../../Components/Buttons/RefreshButton.js";
import { MultiCreateButton } from "../../Components/Buttons/MultiCreateButton.js";
import { ManagementButtonStack } from "../../Components/ManagementPage/ManagementButtonStack.js";
import { User } from "../../Classes/Entities/User.js";
import { ManagementPageContainer } from "../../Components/ManagementPage/ManagementPageContainer.js";
import { ManagementPageHeader } from "../../Components/ManagementPage/ManagementPageHeader.js";
import { ManagementPageBody } from "../../Components/ManagementPage/ManagementPageBody.js";
import { ManagementPageFooter } from "../../Components/ManagementPage/ManagementPageFooter.js";
import { useDialogState } from "../../Hooks/useDialogState.js";

const CourseManagement = () => {
    const [coursesCombinedState, setCourses, setSelectedCourses, filterCourses] = useItemsReducer(Course);
    const [users, setUsers] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isError, setIsError] = useState(false);

    const [assignUserDialogIsOpen, setAssignUserDialogIsOpen] = useState(false);
    const [assignUserDialogCourses, setAssignUserDialogCourses] = useState([]);

    const [createDialogState, handleOpenMultiCreateDialog] = useDialogState();
    const [editDialogState, openEditDialog] = useDialogState(false);
    const [deleteDialogState, openDeleteDialog] = useDialogState(false);

    const [searchQuery, setSearchQuery] = useState("");

    const handleClearFilters = useCallback(() => {
        setSearchQuery("");
    }, []);

    const [appUser] = useAppUser();
    const navigate = useNavigate();
    useTitle("Course Management");

    useAccountNavTitle("Course Management");

    const handleRefresh = useCallback(async () => {
        try {
            setIsError(false);

            const [fetchedCourses, fetchedUsers] = await Promise.all([
                Course.handleFetchAll(),
                User.handleFetchAll()
            ]);

            setCourses(fetchedCourses);
            setUsers(fetchedUsers);

            setIsLoaded(true);
        } catch (error) {
            setIsError(true);
        }
    }, [setCourses]);

    useEffect(() => {
        if (appUser.is_admin) {
            handleRefresh();
        }
    }, [appUser.is_admin, handleRefresh]);

    const courseFilterFunction = useCallback((course) => {
        return doesItemMatchSearchQuery(searchQuery, course, ["name", "notes"]);
    }, [searchQuery]);

    useEffect(() => {
        filterCourses(courseFilterFunction);
    }, [filterCourses, courseFilterFunction]);

    const handleOpenCourseEditDialog = useCallback((course) => {
        openEditDialog(course);
    }, [openEditDialog]);

    const handleOpenCourseDeleteDialog = useCallback((course) => {
        openDeleteDialog(course);
    }, [openDeleteDialog]);

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
                handleOpenMultiCreateDialog,
                handleOpenAssignCourseUserDialog,
                handleClearFilters,
                handleRefresh
            }}
            setItems={setCourses}
            setSelectedItems={setSelectedCourses}
        >
            <ManagementPageContainer>
                <ManagementPageHeader>
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
                </ManagementPageHeader>

                <ManagementPageBody>
                    <DataTable
                        defaultSortAscending
                        defaultSortColumn="ID"
                        emptyMinHeight="300px"
                        rowSelectionEnabled
                        sx={{ gridArea: "table" }}
                        tableFields={Course.tableFields}
                    />
                </ManagementPageBody>

                <ManagementPageFooter>
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
                </ManagementPageFooter>

            </ManagementPageContainer>

            <ItemMultiCreateDialog dialogState={createDialogState} />

            <ItemSingleEditDialog dialogState={editDialogState} />

            <ItemSingleDeleteDialog dialogState={deleteDialogState} />

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
