import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Checkbox, Paper, Stack, TableCell, TableContainer, Typography, Table, TableBody, TableHead, TableRow, Skeleton } from "@mui/material";
import { useTheme } from "@emotion/react";
import { ColumnSortButton } from "./Buttons/ColumnSortButton.js";
import PropTypes from "prop-types";
import { InView } from "react-intersection-observer";
import { useAppDarkTheme } from "../ContextProviders/AppFeatures.js";
import { FullPageMessage } from "../Components/FullPageMessage.js";

const DataTableCell = ({ tf, itemAsString }) => {
    return useMemo(() => {
        return (
            <TableCell sx={{ maxWidth: tf.maxWidth ?? "unset", wordWrap: tf.maxWidth ? "break-word" : "unset" }}>
                {tf.generateTableCell(JSON.parse(itemAsString))}
            </TableCell>
        );
    }, [itemAsString]);
};

DataTableCell.propTypes = {
    tf: PropTypes.object,
    itemAsString: PropTypes.string
};

const DataTableFieldCells = ({ tableFields, item: itemAsString }) => {
    return useMemo(() => {
        return tableFields.map((tf) => {
            return (
                <DataTableCell key={tf.columnDescription} {...{ tf, itemAsString }} />
            );
        }
        );
    }, [itemAsString]);
};

const TableRowPlaceholder = memo(function TableContainer ({ colSpan }) {
    return (
        <TableCell colSpan={colSpan} >
            <Skeleton variant="text" height="20px" width="100%" />
        </TableCell>
    );
});

TableRowPlaceholder.propTypes = {
    colSpan: PropTypes.number.isRequired
};

export const DataTable = ({
    tableFields, items,
    rowSelectionEnabled, selectedItems, setSelectedItems, visibleItems,
    defaultSortColumn, defaultSortAscending,
    NoContentIcon, noContentMessage, noContentButtonAction, noContentButtonText
}) => {
    const theme = useTheme();
    const { appDarkTheme } = useAppDarkTheme();

    const [sortColumn, setSortColumn] = useState(defaultSortColumn ?? "ID");
    const [sortAscending, setSortAscending] = useState(defaultSortAscending ?? true);

    const sortRoutine = useCallback((a, b) => {
        const [, aSortableValues] = a;
        const [, bSortableValues] = b;
        return ((aSortableValues[sortColumn] ?? "") > (bSortableValues[sortColumn] ?? "")) ? 1 : -1;
    }, [sortColumn]);

    useEffect(() => {
        if (selectedItems) { setSelectedItems(selectedItems.filter((si) => items.map((i) => i.id).includes(si.id))); }
    }, [items]);

    const sortableValuesByRow = useMemo(() => {
        const output = { };
        (items ?? []).map((item) => {
            const sortableValues = {};
            for (const tf of tableFields) {
                if (tf.generateSortableValue) { sortableValues[tf.columnDescription] = tf.generateSortableValue(item); }
            }
            output[item.id] = sortableValues;
            return null;
        });
        return output;
    }, [items]);

    const itemInformation = useMemo(() => {
        const itemInformationToReturn = (
            (items ?? []).map((item) => {
                const isSelected = Boolean(selectedItems?.map((si) => si.id).includes(item.id));
                const themeColor = item.is_admin_or_collection_manager ? "secondary" : "primary";

                const sortableValues = sortableValuesByRow[item.id];

                const renderedTableRow = (
                    <InView key={item.id} triggerOnce={true}>
                        {({ inView, ref }) => (
                            <TableRow ref={ref} sx={{
                                "&:hover": {
                                    backgroundColor: isSelected ? theme.palette[themeColor].translucent : theme.palette.grey.veryTranslucent

                                },
                                "&:not(:hover)": {
                                    backgroundColor: isSelected ? theme.palette[themeColor].veryTranslucent : ""
                                }
                            }}>
                                {Boolean(rowSelectionEnabled) && (<TableCell width="10px">
                                    <Checkbox checked={isSelected}
                                        color={themeColor}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedItems([...selectedItems, item]);
                                            } else {
                                                setSelectedItems(selectedItems.filter((si) => si.id !== item.id));
                                            }
                                        }}
                                        size="large" />
                                </TableCell>)}
                                {(inView && <React.Fragment>
                                    <DataTableFieldCells item={JSON.stringify(item)} {...{ tableFields }} />
                                </React.Fragment>) || (!inView && (
                                    <TableRowPlaceholder colSpan={tableFields.length} />
                                ))}
                            </TableRow>
                        )}
                    </InView>
                );

                return [item, sortableValues, renderedTableRow];
            })
        );
        return itemInformationToReturn;
    }, [items, selectedItems, appDarkTheme]);

    const visibleItemInformation = useMemo(() => itemInformation.filter((r) => visibleItems.map((vi) => vi.id).includes(r[0].id)), [itemInformation, visibleItems]);

    const sortedItemInformation = useMemo(() => visibleItemInformation.toSorted(sortRoutine), [visibleItemInformation, sortColumn]);

    const renderedItems = useMemo(() => sortedItemInformation.map((r) => r[2]), [sortedItemInformation]);

    const itemsInFinalDisplayOrder = useMemo(() => {
        if (sortAscending) { return renderedItems; } else { return renderedItems.toReversed(); }
    }, [renderedItems, sortAscending]);

    const visibleSelectedItems = selectedItems ? visibleItems.filter((i) => selectedItems.map((si) => si.id).includes(parseInt(i.id))) : visibleItems;

    return (
        <TableContainer component={Paper} sx={{
            width: "100%",
            height: "100%",
            display: "grid",
            gridTemplateAreas: `
                "header"
                "rows"
            `,
            gridTemplateRows: "40px calc(100% - 40px)"
        }}>
            <Table stickyHeader size="small">
                <TableHead sx={{ gridArea: "header" }}>
                    <TableRow>
                        {Boolean(rowSelectionEnabled) && (
                            <TableCell sx={{ backgroundColor: theme.palette.grey.translucent }}>
                                <Typography variant="body1">
                                    <Checkbox checked={
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
                                    size="large" />
                                </Typography>
                            </TableCell>
                        )}
                        {tableFields.map((tf) => {
                            return (
                                <React.Fragment key={tf.columnDescription}>
                                    <TableCell sx={{ backgroundColor: theme.palette.grey.translucent }}>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <Typography variant="h6">{tf.columnDescription}</Typography>
                                            {tf.generateSortableValue && (
                                                <ColumnSortButton columnName={tf.columnDescription} {...{ sortAscending, setSortAscending, sortColumn, setSortColumn }} />
                                            )}
                                        </Stack>
                                    </TableCell>
                                </React.Fragment>
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
                    message={noContentMessage ?? "This list is empty"}
                    buttonAction={noContentButtonAction}
                    buttonText={noContentButtonText}
                />
            )}
        </TableContainer>
    );
};

DataTable.propTypes = {
    tableFields: PropTypes.arrayOf(PropTypes.object),
    items: PropTypes.arrayOf(PropTypes.object),
    rowSelectionEnabled: PropTypes.bool,
    selectedItems: PropTypes.arrayOf(PropTypes.object),
    setSelectedItems: PropTypes.func,
    visibleItems: PropTypes.arrayOf(PropTypes.object),
    defaultSortColumn: PropTypes.string,
    defaultSortAscending: PropTypes.bool,
    NoContentIcon: PropTypes.elementType,
    noContentMessage: PropTypes.string,
    noContentButtonAction: PropTypes.func,
    noContentButtonText: PropTypes.string
};
