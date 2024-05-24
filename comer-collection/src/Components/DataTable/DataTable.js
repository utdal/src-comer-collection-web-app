import React, { memo, useCallback, useMemo, useState } from "react";
import { Checkbox, Paper, Stack, TableCell, TableContainer, Typography, Table, TableBody, TableHead, TableRow } from "@mui/material";
import { useTheme } from "@emotion/react";
import { ColumnSortButton } from "../Buttons/ColumnSortButton.js";
import PropTypes from "prop-types";
import { FullPageMessage } from "../FullPageMessage.js";
import { TableRowProvider } from "../../ContextProviders/TableRowProvider.js";
import { useItems, useManagementCallbacks, useSelectedItems, useSelectedVisibleItems, useVisibleItems } from "../../ContextProviders/ManagementPageProvider.js";
import { tableFieldPropTypeShape } from "../../Classes/Entity.js";
import { InfoIcon } from "../../Imports/Icons.js";
import DataTableRow from "./DataTableRow.js";

export const DataTable = memo(function DataTable ({
    tableFields, rowSelectionEnabled, smallCheckboxes, defaultSortColumn, defaultSortAscending
}) {
    const theme = useTheme();
    const [items] = useItems();
    const [selectedItems, setSelectedItems] = useSelectedItems();
    const [visibleItems] = useVisibleItems();
    const selectedVisibleItems = useSelectedVisibleItems();
    const managementCallbacks = useManagementCallbacks();

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
        const itemInformationToReturn = (
            (items ?? []).map((item) => {
                const isSelected = Boolean(selectedItems?.map((si) => si.id).includes(item.id));
                const themeColor = item.is_admin_or_collection_manager ? "secondary" : "primary";

                const sortableValues = sortableValuesByRow[item.id];

                const renderedTableRow = (
                    <TableRowProvider
                        item={item}
                        managementCallbacks={managementCallbacks}
                        selectedItems={selectedItems}
                        setSelectedItems={setSelectedItems}
                    >
                        <DataTableRow
                            isSelected={isSelected}
                            rowSelectionEnabled={rowSelectionEnabled}
                            smallCheckboxes={smallCheckboxes}
                            tableFields={tableFields}
                            themeColor={themeColor}
                        />
                    </TableRowProvider>
                );

                return [item, sortableValues, renderedTableRow];
            })
        );
        return itemInformationToReturn;
    }, [items, managementCallbacks, rowSelectionEnabled, selectedItems, setSelectedItems, smallCheckboxes, sortableValuesByRow, tableFields]);

    const visibleItemInformation = useMemo(() => itemInformation.filter((r) => visibleItems.map((vi) => vi.id).includes(r[0].id)), [itemInformation, visibleItems]);

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
            sx={{
                width: "100%",
                height: "100%",
                display: "grid",
                gridTemplateAreas: `
                "header"
                "rows"
            `,
                gridTemplateRows: "40px calc(100% - 40px)"
            }}
        >
            <Table
                size="small"
                stickyHeader
            >
                <TableHead sx={{ gridArea: "header" }}>
                    <TableRow>
                        {Boolean(rowSelectionEnabled) && (
                            <TableCell sx={{ backgroundColor: theme.palette.grey.translucent }}>
                                <Typography variant="body1">
                                    <Checkbox
                                        checked={
                                            selectedVisibleItems.length === visibleItems.length && visibleItems.length > 0
                                        }
                                        disabled={visibleItems.length === 0}
                                        indeterminate={
                                            (selectedVisibleItems.length > 0 && selectedVisibleItems.length < visibleItems.length) || visibleItems.length === 0
                                        }
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedItems([...selectedItems, ...visibleItems.filter((i) => (
                                                    !selectedItems.map((si) => si.id).includes(parseInt(i.id))
                                                ))]);
                                            } else {
                                                setSelectedItems(selectedItems.filter((si) => (
                                                    !selectedVisibleItems.map((vsi) => vsi.id).includes(parseInt(si.id))
                                                )));
                                            }
                                        }}
                                        size={smallCheckboxes ? "medium" : "large"}
                                    />
                                </Typography>
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

                <TableBody sx={{ gridArea: "rows" }}>
                    {itemsInFinalDisplayOrder}
                </TableBody>
            </Table>

            {visibleItems.length === 0 && (
                <FullPageMessage
                    Icon={InfoIcon}
                    buttonAction={null}
                    buttonText={null}
                    message={items.length === 0 ? "This list is empty" : "All items are hidden"}
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
    tableFields: PropTypes.arrayOf(PropTypes.shape(tableFieldPropTypeShape)).isRequired
};
