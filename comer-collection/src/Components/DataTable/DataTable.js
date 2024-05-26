/* eslint-disable react/no-multi-comp */
import React, { memo, useCallback, useMemo, useState } from "react";
import { Checkbox, Stack, TableCell, TableContainer, Typography, Table, TableBody, TableHead, TableRow, Paper } from "@mui/material";
import { useTheme } from "@emotion/react";
import { ColumnSortButton } from "../Buttons/ColumnSortButton.js";
import PropTypes from "prop-types";
import { useItemCounts, useItemDictionary, useItems, useManagementCallbacks, useSelectionStatuses, useVisibilityStatuses } from "../../ContextProviders/ManagementPageProvider.js";
import { tableFieldPropTypeShape } from "../../Classes/Entity.js";
import { FullPageMessage } from "../FullPageMessage.js";
import { InfoIcon } from "../../Imports/Icons.js";
import DataTableRow from "./DataTableRow.js";

export const DataTable = memo(function DataTable ({
    tableFields, rowSelectionEnabled, smallCheckboxes, defaultSortColumn, defaultSortAscending
}) {
    const theme = useTheme();
    const [items] = useItems();
    const itemDictionary = useItemDictionary();

    const [visibilityStatuses] = useVisibilityStatuses();
    const itemCounts = useItemCounts();

    const managementCallbacks = useManagementCallbacks();

    const [selectionStatuses, setItemSelectionStatus] = useSelectionStatuses();

    const [sortColumn, setSortColumn] = useState(defaultSortColumn ?? "ID");
    const [sortAscending, setSortAscending] = useState(defaultSortAscending ?? true);

    const sortRoutine = useCallback((a, b) => {
        const [, aSortableValues] = a;
        const [, bSortableValues] = b;
        return ((aSortableValues[sortColumn] ?? "") > (bSortableValues[sortColumn] ?? "")) ? 1 : -1;
    }, [sortColumn]);

    const sortableValuesByRow = useMemo(() => {
        const output = { };
        (items ?? []).map((item) => {
            const sortableValues = {};
            for (const tf of tableFields) {
                if (tf.generateSortableValue) {
                    sortableValues[tf.columnDescription] = tf.generateSortableValue(item);
                }
            }
            output[item.id] = sortableValues;
            return null;
        });
        return output;
    }, [items, tableFields]);

    const itemInformation = useMemo(() => {
        /**
         * @type {import("../../ContextProviders/ManagementPageProvider.js").Item[]}
         */
        const items = Object.values(itemDictionary);
        console.log(items);
        const itemInformationToReturn = (
            items.map((item) => {
                const sortableValues = sortableValuesByRow[item.id];

                const themeColor = item.is_admin_or_collection_manager ? "secondary" : "primary";

                const renderedTableRow = (
                    <DataTableRow
                        isSelected={Boolean(selectionStatuses[item.id])}
                        item={item}
                        key={item.id}
                        managementCallbacks={managementCallbacks}
                        rowSelectionEnabled={rowSelectionEnabled}
                        setItemSelectionStatus={setItemSelectionStatus}
                        smallCheckboxes={smallCheckboxes}
                        tableFields={tableFields}
                        themeColor={themeColor}
                    />
                );

                return [item, sortableValues, renderedTableRow];
            })
        );
        return itemInformationToReturn;
    }, [itemDictionary, managementCallbacks, rowSelectionEnabled, selectionStatuses, setItemSelectionStatus, smallCheckboxes, sortableValuesByRow, tableFields]);

    const visibleItemInformation = useMemo(() => itemInformation.filter((r) => visibilityStatuses[r[0].id]), [itemInformation, visibilityStatuses]);

    const sortedItemInformation = useMemo(() => visibleItemInformation.toSorted(sortRoutine), [visibleItemInformation, sortRoutine]);

    const renderedItems = useMemo(() => sortedItemInformation.map((r) => r[2]), [sortedItemInformation]);

    const itemsInFinalDisplayOrder = useMemo(() => {
        if (sortAscending) {
            return renderedItems;
        } else {
            return renderedItems.toReversed();
        }
    }, [renderedItems, sortAscending]);

    return (
        <TableContainer
            component={Paper}
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
                    {itemsInFinalDisplayOrder}
                </TableBody>
            </Table>

            {itemCounts.visible === 0 && (
                <FullPageMessage
                    Icon={InfoIcon}
                    buttonAction={null}
                    buttonText={null}
                    message={itemCounts.all === 0 ? "This list is empty" : "All items are hidden"}
                />
            )}
        </TableContainer>
    );
});

DataTable.propTypes = {
    defaultSortAscending: PropTypes.bool,
    defaultSortColumn: PropTypes.string,
    rowSelectionEnabled: PropTypes.bool,
    smallCheckboxes: PropTypes.bool,
    tableFields: PropTypes.arrayOf(tableFieldPropTypeShape).isRequired
};
