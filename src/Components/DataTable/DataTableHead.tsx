import React from "react";
import { Checkbox, Stack, TableCell, Typography, TableHead, TableRow, useTheme } from "@mui/material";
import ColumnSortButton from "../Buttons/ColumnSortButton";
import type { TableFieldDefinition } from "../..";
import { useItemCounts } from "../../ContextProviders/ManagementPageProvider";

const DataTableHead = ({
    tableFields, rowSelectionEnabled, smallCheckboxes,
    sortColumn, setSortColumn, sortAscending, setSortAscending
}: {
    readonly tableFields: TableFieldDefinition[];
    readonly rowSelectionEnabled: boolean;
    readonly smallCheckboxes?: boolean;
    readonly sortColumn: string;
    readonly setSortColumn: React.Dispatch<React.SetStateAction<string>>;
    readonly sortAscending: boolean;
    readonly setSortAscending: React.Dispatch<React.SetStateAction<boolean>>;
}): React.JSX.Element => {
    
    const itemCounts = useItemCounts();
    const theme = useTheme();

    return (
        <TableHead>
            <TableRow>
                {Boolean(rowSelectionEnabled) && (
                    <TableCell sx={{ backgroundColor: theme.palette.neutral.slightlyTranslucent }}>
                        <Checkbox
                            checked={
                                itemCounts.selectedAndVisible === itemCounts.visible && itemCounts.visible > 0
                            }
                            disabled 
                            /* visibleItems.length === 0 */
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
    
                {tableFields.map((tf) => (
                    <TableCell
                        key={tf.columnDescription}
                        sx={{ backgroundColor: theme.palette.neutral.slightlyTranslucent }}
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
                ))}
            </TableRow>
        </TableHead>
    );
};

export default DataTableHead;