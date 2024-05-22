import React, { useCallback, useMemo, useState } from "react";
import { Checkbox, Paper, Stack, TableCell, TableContainer, Typography, Table, TableBody, TableHead, TableRow } from "@mui/material";
import { useTheme } from "@emotion/react";
import { ColumnSortButton } from "../Buttons/ColumnSortButton.js";
import PropTypes from "prop-types";
import { InView } from "react-intersection-observer";
import { FullPageMessage } from "../FullPageMessage.js";
import { TableRowProvider } from "../../ContextProviders/TableRowProvider.js";
import { useItems, useSelectedItems, useVisibleItems } from "../../ContextProviders/ManagementPageProvider.js";
import { DataTableFieldCells } from "./DataTableFieldCells.js";
import { TableRowPlaceholder } from "./TableRowPlaceholder.js";
import { tableFieldPropTypeShape } from "../../Classes/Entity.js";

export const DataTable = ({
    tableFields, rowSelectionEnabled, defaultSortColumn, defaultSortAscending,
    NoContentIcon, noContentMessage, noContentButtonAction, noContentButtonText
}) => {
    const theme = useTheme();
    const [items] = useItems();
    const [selectedItems, setSelectedItems] = useSelectedItems();
    const [visibleItems] = useVisibleItems();

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
                    <InView
                        key={item.id}
                        triggerOnce
                    >
                        {({ inView, ref }) => (
                            <TableRowProvider item={item} >
                                <TableRow
                                    color="secondary"
                                    ref={ref}
                                    sx={{
                                        "&:hover": {
                                            backgroundColor: isSelected ? theme.palette[themeColor].translucent : theme.palette.grey.veryTranslucent

                                        },
                                        "&:not(:hover)": {
                                            backgroundColor: isSelected ? theme.palette[themeColor].veryTranslucent : ""
                                        }
                                    }}
                                >
                                    {Boolean(rowSelectionEnabled) && (
                                        <TableCell width="10px">
                                            <Checkbox
                                                checked={isSelected}
                                                color={themeColor}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedItems([...selectedItems, item]);
                                                    } else {
                                                        setSelectedItems(selectedItems.filter((si) => si.id !== item.id));
                                                    }
                                                }}
                                                size="large"
                                            />
                                        </TableCell>)}

                                    {
                                        inView
                                            ? (
                                                <DataTableFieldCells
                                                    item={JSON.stringify(item)}
                                                    tableFields={tableFields}
                                                />
                                            )
                                            : (
                                                <TableRowPlaceholder colSpan={tableFields.length} />
                                            )
                                    }
                                </TableRow>
                            </TableRowProvider>
                        )}
                    </InView>
                );

                return [item, sortableValues, renderedTableRow];
            })
        );
        return itemInformationToReturn;
    }, [items, selectedItems, setSelectedItems, rowSelectionEnabled, sortableValuesByRow, tableFields, theme]);

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

    const visibleSelectedItems = selectedItems ? visibleItems.filter((i) => selectedItems.map((si) => si.id).includes(parseInt(i.id))) : visibleItems;

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
                                            visibleSelectedItems.length === visibleItems.length && visibleItems.length > 0
                                        }
                                        disabled={visibleItems.length === 0}
                                        indeterminate={
                                            (visibleSelectedItems.length > 0 && visibleSelectedItems.length < visibleItems.length) || visibleItems.length === 0
                                        }
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedItems([...selectedItems, ...visibleItems.filter((i) => (
                                                    !selectedItems.map((si) => si.id).includes(parseInt(i.id))
                                                ))]);
                                            } else {
                                                setSelectedItems(selectedItems.filter((si) => (
                                                    !visibleSelectedItems.map((vsi) => vsi.id).includes(parseInt(si.id))
                                                )));
                                            }
                                        }}
                                        size="large"
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
                    Icon={NoContentIcon}
                    buttonAction={noContentButtonAction}
                    buttonText={noContentButtonText}
                    message={noContentMessage ?? "This list is empty"}
                />
            )}
        </TableContainer>
    );
};

DataTable.propTypes = {
    NoContentIcon: PropTypes.elementType.isRequired,
    defaultSortAscending: PropTypes.bool.isRequired,
    defaultSortColumn: PropTypes.string.isRequired,
    noContentButtonAction: PropTypes.func.isRequired,
    noContentButtonText: PropTypes.string.isRequired,
    noContentMessage: PropTypes.string.isRequired,
    rowSelectionEnabled: PropTypes.bool,
    tableFields: PropTypes.arrayOf(PropTypes.shape(tableFieldPropTypeShape)).isRequired
};

DataTable.defaultProps = {
    rowSelectionEnabled: false
};
