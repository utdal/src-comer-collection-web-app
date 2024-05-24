import React, { memo, useCallback } from "react";
import PropTypes from "prop-types";
import { useInView } from "react-intersection-observer";
import { useTableRowItem, useTableRowManagementCallbacks, useSetSelectionStatus, useTableCheckboxSettings } from "../../ContextProviders/TableRowProvider.js";
import { Checkbox, TableCell, TableRow, styled } from "@mui/material";
import { DataTableFieldCells } from "./DataTableFieldCells.js";
import { TableRowPlaceholder } from "./TableRowPlaceholder.js";

const ColoredTableRow = styled(TableRow)(({ isSelected, theme, themeColor }) => ({
    "&:hover": {
        backgroundColor: isSelected ? theme.palette[themeColor].translucent : theme.palette.grey.veryTranslucent

    },
    "&:not(:hover)": {
        backgroundColor: isSelected ? theme.palette[themeColor].veryTranslucent : ""
    }
}));

const DataTableRow = memo(function DataTableRow ({ isSelected, themeColor }) {
    const { inView, ref } = useInView({
        triggerOnce: true
    });

    const item = useTableRowItem();
    const { rowSelectionEnabled, smallCheckboxes } = useTableCheckboxSettings();

    const managementCallbacks = useTableRowManagementCallbacks();
    const setSelectionStatus = useSetSelectionStatus();

    const handleCheckboxChange = useCallback((e) => {
        setSelectionStatus(e.target.checked);
    }, [setSelectionStatus]);

    return (
        <ColoredTableRow
            isSelected={isSelected}
            ref={ref}
            themeColor={themeColor}
        >
            {Boolean(rowSelectionEnabled) && (
                <TableCell width="10px">
                    <Checkbox
                        checked={isSelected}
                        color={themeColor}
                        onChange={handleCheckboxChange}
                        size={smallCheckboxes ? "medium" : "large"}
                    />
                </TableCell>)}

            {
                inView
                    ? (
                        <DataTableFieldCells
                            item={item}
                            managementCallbacks={managementCallbacks}
                        />
                    )
                    : (
                        <TableRowPlaceholder />
                    )
            }
        </ColoredTableRow>
    );
});

DataTableRow.propTypes = {
    isSelected: PropTypes.bool,
    themeColor: PropTypes.string
};

export default DataTableRow;
