import React, { memo, useCallback } from "react";
import PropTypes from "prop-types";
import { useInView } from "react-intersection-observer";
import { useTableRowManagementCallbacks, useSetSelectionStatus, useTableCheckboxSettings, useTableRowItem, useTableFields } from "../../ContextProviders/TableRowProvider.js";
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

/**
 * @typedef {import("../../ContextProviders/ManagementPageProvider.js").ItemDictionaryEntry} ItemDictionaryEntry
 * @type {(props: {
 *      isSelected: boolean,
 *      themeColor: string
 * }) => React.JSX.Element}
 */
const DataTableRow = memo(function DataTableRow ({ isSelected, themeColor }) {
    const { inView, ref } = useInView({
        triggerOnce: true
    });

    const { rowSelectionEnabled, smallCheckboxes } = useTableCheckboxSettings();

    const itemDictionaryEntry = useTableRowItem();

    const tableFields = useTableFields();

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
            {
                inView
                    ? (
                        <>
                            {rowSelectionEnabled
                                ? (
                                    <TableCell width="10px">
                                        <Checkbox
                                            checked={isSelected}
                                            color={themeColor}
                                            onChange={handleCheckboxChange}
                                            size={smallCheckboxes ? "medium" : "large"}
                                        />
                                    </TableCell>
                                )
                                : null}

                            <DataTableFieldCells
                                itemDictionaryEntry={itemDictionaryEntry}
                                managementCallbacks={managementCallbacks}
                                tableFields={tableFields}
                            />
                        </>
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
