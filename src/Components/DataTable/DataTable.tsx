/* eslint-disable react/no-multi-comp */
import type { ElementType } from "react";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Checkbox, Stack, TableCell, TableContainer, Typography, Table, TableBody, TableHead, TableRow, Paper } from "@mui/material";
import ColumnSortButton from "../Buttons/ColumnSortButton";
import { useItemCounts, useItemDictionary, useItemsPagination, useManagementCallbacks, useSelectionStatuses, useSortableValues, useVisibilityStatuses } from "../../ContextProviders/ManagementPageProvider";
import { FullPageMessage } from "../FullPageMessage";
import { InfoIcon } from "../../Imports/Icons";
import DataTableRow from "./DataTableRow";
import type { Item, TableFieldDefinition, UserItem } from "../../index";

const DataTable = ({
    tableFields, rowSelectionEnabled, smallCheckboxes, defaultSortColumn = "ID", defaultSortAscending = true, noSkeleton
}: {
    readonly tableFields: TableFieldDefinition[];
    readonly rowSelectionEnabled: boolean;
    readonly smallCheckboxes?: boolean;
    readonly defaultSortColumn?: string;
    readonly defaultSortAscending?: boolean;
    readonly noSkeleton?: boolean;
}): React.JSX.Element => {
    const itemDictionary = useItemDictionary();

    const [visibilityStatuses] = useVisibilityStatuses();
    const itemCounts = useItemCounts();
    const { paginationStatus } = useItemsPagination();

    const managementCallbacks = useManagementCallbacks();

    const [selectionStatuses, setItemSelectionStatus] = useSelectionStatuses();

    const [sortColumn, setSortColumn] = useState(defaultSortColumn);
    const [sortAscending, setSortAscending] = useState(defaultSortAscending);

    const { sortableValueDictionary, calculateSortableItemValues } = useSortableValues();

    const tableContainerRef = useRef((null as unknown) as HTMLDivElement);

    /**
     * When the page is changed, scroll to the top
     */
    useEffect(() => {
        if (paginationStatus.startIndex >= 0) {
            tableContainerRef.current.scrollTo(0, 0);
        }
    }, [paginationStatus.startIndex]);

    useEffect(() => {
        const tableFieldToSort: TableFieldDefinition | undefined = tableFields.find((tf) => tf.columnDescription === sortColumn);
        if (tableFieldToSort?.generateSortableValue) {
            calculateSortableItemValues(tableFieldToSort.generateSortableValue);
        }
        throw new Error("Could not sort table properly");
    }, [calculateSortableItemValues, sortColumn, tableFields]);

    const sortRoutine = useCallback((itemA: Item, itemB: Item): number => {
        return sortableValueDictionary[itemA.id] > sortableValueDictionary[itemB.id] ? 1 : -1;
    }, [sortableValueDictionary]);

    /**
     * The array of items to render in the table is determined in four steps,
     * with each step building on the previous one:
     * 1) Derive items array from item dictionary.
     * 2) Filter the items
     * 3) Sort the items
     * 4) Reverse the items if descending order is requested
     * 5) Splice the items based on pagination status
     */

    /**
     * Memoize the array representation of the items (converted from Object format)
     */
    const itemArray: Item[] = useMemo(() => {
        return Object.values(itemDictionary);
    }, [itemDictionary]);

    /**
     * Reapply the filter when any visibility status changes
     * or when the items change
     */
    const visibleItemArray: Item[] = useMemo(() => {
        return itemArray.filter((item) => visibilityStatuses[item.id]);
    }, [itemArray, visibilityStatuses]);

    /**
     * Reapply the sort order when the sort function changes
     * or the visible items change
     */
    const sortedVisibleItemArray: Item[] = useMemo(() => {
        return [...visibleItemArray].sort(sortRoutine);
    }, [sortRoutine, visibleItemArray]);

    /**
     * Reverse the array if descending sort order is requested
     */
    const directionallySortedVisibleItemArray = useMemo(() => {
        if (sortAscending) {
            return [...sortedVisibleItemArray];
        } else {
            return [...sortedVisibleItemArray].reverse();
        }
    }, [sortAscending, sortedVisibleItemArray]);

    /**
     * Apply pagination to the array
     */
    const finalItemArray: Item[] = useMemo(() => {
        if (paginationStatus.enabled) {
            return directionallySortedVisibleItemArray.slice(paginationStatus.startIndex, paginationStatus.endIndex + 1);
        } else {
            return directionallySortedVisibleItemArray;
        }
    }, [directionallySortedVisibleItemArray, paginationStatus]);

    const renderedTableRows: React.ReactNode = useMemo(() => (
        finalItemArray.map((item) => {
            const themeColor = (item as UserItem).is_admin_or_collection_manager ? "secondary" : "primary";

            const renderedTableRow = (
                <DataTableRow
                    isSelected={Boolean(selectionStatuses[item.id])}
                    item={item}
                    key={item.id}
                    managementCallbacks={managementCallbacks}
                    noSkeleton={noSkeleton}
                    rowSelectionEnabled={rowSelectionEnabled}
                    setItemSelectionStatus={setItemSelectionStatus}
                    smallCheckboxes={smallCheckboxes}
                    tableFields={tableFields}
                    themeColor={themeColor}
                />
            );

            return renderedTableRow;
        })
    ), [finalItemArray, managementCallbacks, noSkeleton, rowSelectionEnabled, selectionStatuses, setItemSelectionStatus, smallCheckboxes, tableFields]);

    return (
        <TableContainer
            component={Paper}
            ref={tableContainerRef}
        >
            <Table>
                <TableHead>
                    <TableRow>
                        {Boolean(rowSelectionEnabled) && (
                            <TableCell sx={{ backgroundColor: "gray" }}>
                                <Checkbox
                                    checked={
                                        itemCounts.selectedAndVisible === itemCounts.visible && itemCounts.visible > 0
                                    }
                                    disabled /* visibleItems.length === 0 */
                                    indeterminate={(itemCounts.selectedAndVisible > 0 && itemCounts.selectedAndVisible < itemCounts.visible)}
                                    // (selectedVisibleItems.length > 0 && selectedVisibleItems.length < visibleItems.length) || visibleItems.length === 0
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                                        if (e.target.checked) {
                                            // setSelectedItems([...selectedItems, ...visibleItems.filter((i) => (
                                            //     !selectedItems.map((si) => si.id).includes(parseInt(i.id))
                                            // ))]);
                                        } else {
                                            // setSelectedItems(selectedItems.filter((si) => (
                                            //     !selectedVisibleItems.map((vsi) => vsi.id).includes(parseInt(si.id))
                                            // )));
                                        }
                                    }}
                                    size={smallCheckboxes === true ? "medium" : "large"}
                                />
                            </TableCell>
                        )}

                        {tableFields.map((tf) => {
                            return (
                                <TableCell
                                    key={tf.columnDescription}
                                    sx={{ backgroundColor: "gray" }}
                                >
                                    <Stack
                                        alignItems="center"
                                        direction="row"
                                        spacing={1}
                                    >
                                        <Typography variant="h6">
                                            {tf.columnDescription}
                                        </Typography>

                                        {tf.generateSortableValue
                                            ? (
                                                <ColumnSortButton
                                                    columnName={tf.columnDescription}
                                                    setSortAscending={setSortAscending}
                                                    setSortColumn={setSortColumn}
                                                    sortAscending={sortAscending}
                                                    sortColumn={sortColumn}
                                                />
                                            )
                                            : null}
                                    </Stack>
                                </TableCell>
                            );
                        })}
                    </TableRow>
                </TableHead>

                <TableBody>
                    {renderedTableRows}
                </TableBody>
            </Table>

            {itemCounts.visible === 0 && (
                <FullPageMessage
                    Icon={InfoIcon as ElementType}
                    button={false}
                    message={itemCounts.all === 0 ? "This list is empty" : "All items are hidden"}
                />
            )}
        </TableContainer>
    );
};

export default DataTable;
