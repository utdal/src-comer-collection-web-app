import React, { useCallback, useEffect, useMemo, useState } from "react";
import SearchBox from "../../Components/SearchBox";
import ItemSingleDeleteDialog from "../../Components/Dialogs/ItemSingleDeleteDialog.js";
import DataTable from "../../Components/DataTable/DataTable.js";
import SelectionSummary from "../../Components/SelectionSummary.js";
import ExhibitionSettingsDialog from "../../Components/Dialogs/ExhibitionSettingsDialog.js";
import { useTitle } from "../../ContextProviders/AppFeatures";
import { CourseFilterMenu } from "../../Components/Menus/CourseFilterMenu.js";

import { Exhibition } from "../../Classes/Entities/Exhibition";
import { ManagementPageProvider, useItemsReducer } from "../../ContextProviders/ManagementPageProvider";
import ClearFilterButton from "../../Components/Buttons/ClearFilterButton.js";
import RefreshButton from "../../Components/Buttons/RefreshButton.js";
import ManagementButtonStack from "../../Components/ManagementPage/ManagementButtonStack.js";
import ManagementPageContainer from "../../Components/ManagementPage/ManagementPageContainer.js";
import ManagementPageHeader from "../../Components/ManagementPage/ManagementPageHeader.js";
import ManagementPageBody from "../../Components/ManagementPage/ManagementPageBody.js";
import ManagementPageFooter from "../../Components/ManagementPage/ManagementPageFooter.js";
import { useLoaderData, useRevalidator } from "react-router";
import PaginationSummary from "../../Components/PaginationSummary/PaginationSummary.js";
import type { CourseItem, ExhibitionItem, FilterFunction, Intent, Item } from "../..";
import useDialogStates from "../../Hooks/useDialogStates";

const ExhibitionManagement = (): React.JSX.Element => {
    const exhibitions = useLoaderData() as ExhibitionItem[];
    const revalidator = useRevalidator();

    const [exhibitionsCombinedState, itemsCallbacks] = useItemsReducer(exhibitions);

    const {
        setItems: setExhibitions,
        filterItems: filterExhibitions
    } = itemsCallbacks;

    useEffect(() => {
        setExhibitions(exhibitions);
    }, [setExhibitions, exhibitions]);

    const handleRefresh = useCallback(() => {
        revalidator.revalidate();
    }, [revalidator]);

    const intentArray: Intent[] = ["single-delete", "exhibition-single-update-settings"];
    const {
        dialogStateDictionary,
        openDialogByIntentWithNoUnderlyingItems,
        openDialogByIntentWithSingleUnderlyingItem,
        openDialogByIntentWithMultipleUnderlyingItems,
        closeDialogByIntent
    } = useDialogStates(intentArray);

    const [searchQuery, setSearchQuery] = useState("");

    const [userCourseIdFilter, setUserCourseIdFilter] = useState(null as CourseItem | null);

    useTitle("Exhibition Management");

    const handleClearFilters = useCallback(() => {
        setUserCourseIdFilter(null);
        setSearchQuery("");
    }, []);

    const exhibitionFilterFunction: FilterFunction = useCallback((item: Item) => {
        return (item as ExhibitionItem).id > 0;
    }, []);

    useEffect(() => {
        filterExhibitions(exhibitionFilterFunction);
    }, [filterExhibitions, exhibitionFilterFunction]);

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
            Entity={Exhibition}
            itemsCallbacks={itemsCallbacks}
            itemsCombinedState={exhibitionsCombinedState}
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

                    </ManagementButtonStack>
                </ManagementPageHeader>

                <ManagementPageBody>
                    <DataTable
                        defaultSortAscending={false}
                        defaultSortColumn="Modified"
                        rowSelectionEnabled
                        tableFields={Exhibition.tableFields}
                    />
                </ManagementPageBody>

                <ManagementPageFooter>
                    <SelectionSummary />

                    <PaginationSummary />
                </ManagementPageFooter>

            </ManagementPageContainer>

            <ExhibitionSettingsDialog dialogState={dialogStateDictionary["exhibition-single-update-settings"]} />

            <ItemSingleDeleteDialog dialogState={dialogStateDictionary["single-delete"]} />

        </ManagementPageProvider>
    );
};

export default ExhibitionManagement;
