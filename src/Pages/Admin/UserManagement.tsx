import React, { useCallback, useEffect, useMemo, useState } from "react";
import SearchBox from "../../Components/SearchBox";
import DataTable from "../../Components/DataTable/DataTable.js";
import { useLoaderData, useRevalidator } from "react-router";
import SelectionSummary from "../../Components/SelectionSummary.js";
import { CourseFilterMenu } from "../../Components/Menus/CourseFilterMenu.js";
import { useSnackbar, useTitle } from "../../ContextProviders/AppFeatures";

import { User } from "../../Classes/Entities/User";
import { ManagementPageProvider, useItemsReducer } from "../../ContextProviders/ManagementPageProvider";
import ClearFilterButton from "../../Components/Buttons/ClearFilterButton.js";
import RefreshButton from "../../Components/Buttons/RefreshButton.js";
import { MultiCreateButton } from "../../Components/Buttons/MultiCreateButton.js";
import ManagementButtonStack from "../../Components/ManagementPage/ManagementButtonStack.js";
import ManagementPageContainer from "../../Components/ManagementPage/ManagementPageContainer.js";
import ManagementPageHeader from "../../Components/ManagementPage/ManagementPageHeader.js";
import ManagementPageBody from "../../Components/ManagementPage/ManagementPageBody.js";
import ManagementPageFooter from "../../Components/ManagementPage/ManagementPageFooter.js";
import PaginationSummary from "../../Components/PaginationSummary/PaginationSummary.js";
import useDialogStates from "../../Hooks/useDialogStates.js";
import DialogByIntent from "../../Components/Dialogs/DialogByIntent.js";
import type { CourseItem, FilterFunction, Intent, Item, UserItem } from "../..";
import { Typography } from "@mui/material";

const UserManagement = (): React.JSX.Element => {
    const users = useLoaderData() as UserItem[];
    const revalidator = useRevalidator();

    const [usersCombinedState, itemsCallbacks] = useItemsReducer(users);

    const {
        setItems: setUsers,
        filterItems: filterUsers
    } = itemsCallbacks;

    useEffect(() => {
        setUsers(users);
    }, [setUsers, users]);

    const handleRefresh = useCallback((): void => {
        revalidator.revalidate();
    }, [revalidator]);

    /**
     * @type {Intent[]}
     */
    const intentArray: Intent[] = ["multi-create", "single-edit", "single-delete", "user-reset-password", "user-change-privileges"];
    const {
        dialogStateDictionary,
        openDialogByIntentWithNoUnderlyingItems,
        openDialogByIntentWithSingleUnderlyingItem,
        openDialogByIntentWithMultipleUnderlyingItems,
        closeDialogByIntent
    } = useDialogStates(intentArray);

    const [searchQuery, setSearchQuery] = useState("");
    const [userCourseIdFilter, setUserCourseIdFilter] = useState(null as CourseItem | null);

    const handleClearFilters = useCallback(() => {
        setSearchQuery("");
        setUserCourseIdFilter(null);
    }, []);

    const showSnackbar = useSnackbar();
    useTitle("User Management");

    const userFilterFunction: FilterFunction = useCallback((item: Item) => {
        // return (
        //     !userCourseIdFilter || (userCourseIdFilter && user.Courses.map((c) => c.id).includes(userCourseIdFilter.id))
        // ) && (
        //     doesItemMatchSearchQuery(searchQuery, user, ["full_name", "full_name_reverse", "email_without_domain"])
        // );
        return (item as UserItem).id > 0;
    }, []);

    // const handleOpenUserAssignCourseDialog = useCallback((user) => {
    //     openCourseDialog([user]);
    // }, [openCourseDialog]);

    // const handleOpenUserAssignCourseDialogForSelectedUsers = useCallback(() => {
    //     openCourseDialog(usersCombinedState.selectedItems);
    // }, [openCourseDialog, usersCombinedState.selectedItems]);

    // const handleOpenViewUserExhibitionDialog = useCallback((user) => {
    //     openExhibitionDialog([user]);
    // }, [openExhibitionDialog]);

    const handleChangeUserActivationStatus = useCallback((user: UserItem, newStatus: boolean) => {
        User.handleChangeUserActivationStatus(user.id, newStatus).then((msg) => {
            handleRefresh();
            showSnackbar(msg, "success");
        }).catch((err) => {
            showSnackbar((err as Error).message, "error");
        });
    }, [handleRefresh, showSnackbar]);

    // const handleSwitchToCoursesView = useCallback(() => {
    //     navigate("/Account/Admin/Courses");
    // }, [navigate]);

    // const handleSwitchToExhibitionsView = useCallback(() => {
    //     navigate("/Account/Admin/Exhibitions");
    // }, [navigate]);

    useEffect(() => {
        filterUsers(userFilterFunction);
    }, [filterUsers, userFilterFunction]);

    const managementCallbacks = useMemo(() => ({
        handleChangeUserActivationStatus,
        openDialogByIntentWithNoUnderlyingItems,
        openDialogByIntentWithSingleUnderlyingItem,
        openDialogByIntentWithMultipleUnderlyingItems,
        closeDialogByIntent,
        handleClearFilters,
        handleRefresh
    }), [handleChangeUserActivationStatus,
        handleClearFilters,
        openDialogByIntentWithNoUnderlyingItems,
        openDialogByIntentWithSingleUnderlyingItem,
        openDialogByIntentWithMultipleUnderlyingItems,
        closeDialogByIntent,
        handleRefresh
    ]);

    return (
        <ManagementPageProvider
            Entity={User}
            itemsCallbacks={itemsCallbacks}
            itemsCombinedState={usersCombinedState}
            managementCallbacks={managementCallbacks}
        >
            <ManagementPageContainer>
                <ManagementPageHeader>
                    <SearchBox
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        width="30%"
                    />

                    <CourseFilterMenu
                        courses={[]}
                        filterValue={userCourseIdFilter}
                        setFilterValue={setUserCourseIdFilter}
                    />

                    <ManagementButtonStack>
                        <RefreshButton />

                        <ClearFilterButton />

                        <MultiCreateButton />
                    </ManagementButtonStack>
                </ManagementPageHeader>

                <ManagementPageBody>
                    <DataTable
                        rowSelectionEnabled
                        tableFields={User.tableFields}
                    />
                </ManagementPageBody>

                <ManagementPageFooter>
                    <SelectionSummary />

                    <ManagementButtonStack>
                        <Typography>
                            Placeholder for Course Assignment Button
                        </Typography>

                        {/* <AssociationManageButton
                            handleOpenDialog={handleOpenUserAssignCourseDialogForSelectedUsers}
                            secondaryEntity={Course}
                        /> */}
                    </ManagementButtonStack>

                    <PaginationSummary />

                </ManagementPageFooter>

            </ManagementPageContainer>

            {intentArray.map((intent) => (
                <DialogByIntent
                    dialogState={dialogStateDictionary[intent]}
                    intent={intent}
                    key={intent}
                />
            ))}

            {/* <AssociationManagementDialog
                Association={EnrollmentUserPrimary}
                dialogState={courseDialogState}
                editMode
                handleSwitchToSecondary={handleSwitchToCoursesView}
                secondaryItemsAll={[]}
            />

            <AssociationManagementDialog
                Association={UserExhibition}
                dialogState={exhibitionDialogState}
                handleSwitchToSecondary={handleSwitchToExhibitionsView}
                secondaryItemsAll={[]}
            /> */}

        </ManagementPageProvider>
    );
};

export default UserManagement;
