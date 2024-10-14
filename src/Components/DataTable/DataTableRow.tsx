import React, { memo, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import type { TableRowOwnProps, Theme } from "@mui/material";
import { Checkbox, TableCell, TableRow, styled, useTheme } from "@mui/material";
import DataTableFieldCells from "./DataTableFieldCells";
import DataTableRowPlaceholder from "./DataTableRowPlaceholder";
import type { Item, ManagementCallbacks, TableFieldDefinition } from "../../index";

interface ColoredTableRowProps extends TableRowOwnProps {
    theme: Theme;
    isSelected: boolean;
    themeColor: "primary" | "secondary";
}

const ColoredTableRow = styled(TableRow, {
    shouldForwardProp: (prop) => prop !== "themeColor" && prop !== "isSelected"
})(({ isSelected, theme, themeColor }: ColoredTableRowProps) => ({
    "&:hover": {
        backgroundColor: isSelected ? theme.palette[themeColor].translucent : theme.palette.neutral.translucent

    },
    "&:not(:hover)": {
        backgroundColor: isSelected ? theme.palette[themeColor].veryTranslucent : "unset"
    }
}));

const DataTableRow = ({ item, isSelected, themeColor, managementCallbacks, tableFields, rowSelectionEnabled, smallCheckboxes, setItemSelectionStatus, noSkeleton }: {
    readonly item: Item;
    readonly isSelected: boolean;
    readonly themeColor: "primary" | "secondary";
    readonly managementCallbacks: ManagementCallbacks;
    readonly tableFields: TableFieldDefinition[];
    readonly rowSelectionEnabled: boolean;
    readonly smallCheckboxes?: boolean;
    readonly setItemSelectionStatus: (itemId: number, newStatus: boolean) => void;
    readonly noSkeleton?: boolean;
}): React.JSX.Element => {
    const { inView, ref } = useInView({
        triggerOnce: true
    });
    const theme = useTheme();

    const setSelectionStatus = useCallback((newStatus: boolean): void => {
        setItemSelectionStatus(item.id, newStatus);
    }, [item, setItemSelectionStatus]);

    const handleCheckboxChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectionStatus(e.target.checked);
    }, [setSelectionStatus]);

    return (
        <ColoredTableRow
            isSelected={isSelected}
            ref={ref}
            theme={theme}
            themeColor={themeColor}
        >
            {
                inView || noSkeleton === true
                    ? (
                        <>
                            {rowSelectionEnabled
                                ? (
                                    <TableCell width="10px">
                                        <Checkbox
                                            checked={isSelected}
                                            color={themeColor}
                                            onChange={handleCheckboxChange}
                                            size={smallCheckboxes === true ? "medium" : "large"}
                                        />
                                    </TableCell>
                                )
                                : null}

                            <DataTableFieldCells
                                item={item}
                                managementCallbacks={managementCallbacks}
                                tableFields={tableFields}
                            />
                        </>
                    )
                    : (
                        <DataTableRowPlaceholder
                            colSpan={tableFields.length + (rowSelectionEnabled ? 1 : 0)}
                        />
                    )
            }
        </ColoredTableRow>
    );
};

export default memo(DataTableRow);
