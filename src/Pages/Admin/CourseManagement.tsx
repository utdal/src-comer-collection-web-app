import React, { useCallback, useEffect, useMemo, useState } from "react";
import SearchBox from "../../Components/SearchBox";
import DataTable from "../../Components/DataTable/DataTable";
import { useLoaderData, useRevalidator } from "react-router";
import SelectionSummary from "../../Components/SelectionSummary";
import { useTitle } from "../../ContextProviders/AppFeatures";
import { Course } from "../../Classes/Entities/Course";
import { ManagementPageProvider, useItemsReducer } from "../../ContextProviders/ManagementPageProvider";
import ClearFilterButton from "../../Components/Buttons/ClearFilterButton";
import RefreshButton from "../../Components/Buttons/RefreshButton";
import { MultiCreateButton } from "../../Components/Buttons/MultiCreateButton";
import ManagementButtonStack from "../../Components/ManagementPage/ManagementButtonStack";
import ManagementPageContainer from "../../Components/ManagementPage/ManagementPageContainer";
import ManagementPageHeader from "../../Components/ManagementPage/ManagementPageHeader";
import ManagementPageBody from "../../Components/ManagementPage/ManagementPageBody";
import ManagementPageFooter from "../../Components/ManagementPage/ManagementPageFooter";
import PaginationSummary from "../../Components/PaginationSummary/PaginationSummary";
import DialogByIntent from "../../Components/Dialogs/DialogByIntent";
import useDialogStates from "../../Hooks/useDialogStates";
import type { CourseItem, FilterFunction, Intent, Item } from "../..";
import { Typography } from "@mui/material";

const CourseManagement = (): React.JSX.Element => {
    const courses = useLoaderData() as CourseItem[];
    const revalidator = useRevalidator();

    const [coursesCombinedState, itemsCallbacks] = useItemsReducer(courses);

    const {
        setItems: setCourses,
        filterItems: filterCourses
    } = itemsCallbacks;

    useEffect(() => {
        setCourses(courses);
    }, [setCourses, courses]);

    const handleRefresh = useCallback(() => {
        revalidator.revalidate();
    }, [revalidator]);

    const intentArray: Intent[] = ["multi-create", "single-edit", "single-delete"];
    const {
        dialogStateDictionary,
        openDialogByIntentWithNoUnderlyingItems,
        openDialogByIntentWithSingleUnderlyingItem,
        openDialogByIntentWithMultipleUnderlyingItems,
        closeDialogByIntent
    } = useDialogStates(intentArray);

    const [searchQuery, setSearchQuery] = useState("");

    const handleClearFilters = useCallback(() => {
        setSearchQuery("");
    }, []);

    useTitle("Course Management");

    const courseFilterFunction: FilterFunction = useCallback((item: Item) => {
        return (item as CourseItem).id > 0;
    }, []);

    useEffect(() => {
        filterCourses(courseFilterFunction);
    }, [filterCourses, courseFilterFunction]);

    // const handleOpenAssignCourseUserDialog = useCallback((course) => {
    //     openUserDialog([course]);
    // }, [openUserDialog]);

    // const handleSwitchToUsersView = useCallback(() => {
    //     navigate("/Account/Admin/Users");
    // }, [navigate]);

    const managementCallbacks = useMemo(() => ({
        openDialogByIntentWithNoUnderlyingItems,
        openDialogByIntentWithSingleUnderlyingItem,
        openDialogByIntentWithMultipleUnderlyingItems,
        closeDialogByIntent,
        handleClearFilters,
        handleRefresh
    }), [handleClearFilters,
        openDialogByIntentWithNoUnderlyingItems,
        openDialogByIntentWithSingleUnderlyingItem,
        openDialogByIntentWithMultipleUnderlyingItems,
        closeDialogByIntent,
        handleRefresh
    ]);

    return (
        <ManagementPageProvider
            Entity={Course}
            itemsCallbacks={itemsCallbacks}
            itemsCombinedState={coursesCombinedState}
            managementCallbacks={managementCallbacks}
        >
            <ManagementPageContainer>
                <ManagementPageHeader>
                    <SearchBox
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
                        rowSelectionEnabled
                        tableFields={Course.tableFields}
                    />
                </ManagementPageBody>

                <ManagementPageFooter>
                    <SelectionSummary />

                    <ManagementButtonStack>
                        <Typography>
                            Placeholder for Course/User assignment button
                        </Typography>

                        {/* <AssociationManageButton
                            handleOpenDialog={handleOpenAssignCourseUserDialog}
                            secondaryEntity={User}
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
                Association={EnrollmentCoursePrimary}
                defaultSortAscending
                defaultSortColumn="Name"
                dialogState={userDialogState}
                editMode
                handleSwitchToSecondary={handleSwitchToUsersView}
                secondaryItemsAll={[]}
            /> */}
        </ManagementPageProvider>
    );
};

export default CourseManagement;
