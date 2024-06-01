/* eslint-disable react/no-multi-comp */
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Checkbox, Stack, TableCell, TableContainer, Typography, Table, TableBody, TableHead, TableRow, Paper } from "@mui/material";
import { useTheme } from "@emotion/react";
import { ColumnSortButton } from "../Buttons/ColumnSortButton.js";
import PropTypes from "prop-types";
import { useItemCounts, useItemDictionary, useItemsPagination, useManagementCallbacks, useSelectionStatuses, useSortableValues, useVisibilityStatuses } from "../../ContextProviders/ManagementPageProvider";
import { tableFieldPropTypeShape } from "../../Classes/Entity.ts";
import { FullPageMessage } from "../FullPageMessage";
import { InfoIcon } from "../../Imports/Icons.js";
import DataTableRow from "./DataTableRow.js";

/**
 * Functional component for DataTable
 * @param {{
 *  tableFields,
 *  rowSelectionEnabled,
 *  smallCheckboxes,
 *  defaultSortColumn,
 *  defaultSortAscending,
 *  noSkeleton?: boolean
 * }} props
 * @returns {React.JSX.Element}
 */
export const DataTable = ({
    tableFields, rowSelectionEnabled, smallCheckboxes, defaultSortColumn, defaultSortAscending, noSkeleton
}) => {
    const theme = useTheme();
    const itemDictionary = useItemDictionary();

    const [visibilityStatuses] = useVisibilityStatuses();
    const itemCounts = useItemCounts();
    const { paginationStatus } = useItemsPagination();

    const managementCallbacks = useManagementCallbacks();

    const [selectionStatuses, setItemSelectionStatus] = useSelectionStatuses();

    const [sortColumn, setSortColumn] = useState(defaultSortColumn ?? "ID");
    const [sortAscending, setSortAscending] = useState(defaultSortAscending ?? true);

    const { sortableValueDictionary, calculateSortableItemValues } = useSortableValues();

    /**
     * @type {{current: Element}}
     */
    const tableContainerRef = useRef();

    /**
     * When the page is changed, scroll to the top
     */
    useEffect(() => {
        if (paginationStatus.startIndex >= 0) {
            tableContainerRef.current.scrollTo(0, 0);
        }
    }, [paginationStatus.startIndex]);

    useEffect(() => {
        calculateSortableItemValues(tableFields.find((tf) => tf.columnDescription === sortColumn)?.generateSortableValue);
    }, [calculateSortableItemValues, sortColumn, tableFields]);

    const sortRoutine = useCallback((itemA, itemB) => {
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
     * @type {Item[]}
     */
    const itemArray = useMemo(() => {
        return Object.values(itemDictionary);
    }, [itemDictionary]);

    /**
     * Reapply the filter when any visibility status changes
     * or when the items change
     * @type {Item[]}
     */
    const visibleItemArray = useMemo(() => {
        return itemArray.filter((item) => visibilityStatuses[item.id]);
    }, [itemArray, visibilityStatuses]);

    /**
     * Reapply the sort order when the sort function changes
     * or the visible items change
     * @type {Item[]}
     */
    const sortedVisibleItemArray = useMemo(() => {
        return visibleItemArray.toSorted(sortRoutine);
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
    const finalItemArray = useMemo(() => {
        if (paginationStatus.enabled) {
            return directionallySortedVisibleItemArray.slice(paginationStatus.startIndex, paginationStatus.endIndex + 1);
        } else {
            return directionallySortedVisibleItemArray;
        }
    }, [directionallySortedVisibleItemArray, paginationStatus]);

    const renderedTableRows = useMemo(() => (
        finalItemArray.map((item) => {
            const themeColor = item.is_admin_or_collection_manager ? "secondary" : "primary";

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
                            <TableCell sx={{ backgroundColor: theme.palette.grey.translucent }}>
                                <Checkbox
                                    checked={
                                        itemCounts.selectedAndVisible === itemCounts.visible && itemCounts.visible > 0
                                    }
                                    disabled={1 !== 0 /* visibleItems.length === 0 */}
                                    indeterminate={(itemCounts.selectedAndVisible > 0 && itemCounts.selectedAndVisible < itemCounts.visible)}
                                    // (selectedVisibleItems.length > 0 && selectedVisibleItems.length < visibleItems.length) || visibleItems.length === 0
                                    onChange={(e) => {
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
                                    size={smallCheckboxes ? "medium" : "large"}
                                />
                            </TableCell>
                        )}

                        {tableFields.map((tf) => {
                            return (
                                <TableCell
                                    key={tf.columnDescription}
                                    sx={{ backgroundColor: theme.palette.grey.translucent }}
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
                    Icon={InfoIcon}
                    button={false}
                    message={itemCounts.all === 0 ? "This list is empty" : "All items are hidden"}
                />
            )}
        </TableContainer>
    );
};

DataTable.propTypes = {
    defaultSortAscending: PropTypes.bool,
    defaultSortColumn: PropTypes.string,
    noSkeleton: PropTypes.bool,
    rowSelectionEnabled: PropTypes.bool,
    smallCheckboxes: PropTypes.bool,
    tableFields: PropTypes.arrayOf(tableFieldPropTypeShape).isRequired
};
