import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { useInView } from "react-intersection-observer";
import { useTableRowItem, useTableSelectedItems, useTableRowManagementCallbacks } from "../../ContextProviders/TableRowProvider.js";
import { Checkbox, TableCell, TableRow, styled } from "@mui/material";
import { DataTableFieldCells } from "./DataTableFieldCells.js";
import { TableRowPlaceholder } from "./TableRowPlaceholder.js";
import { tableFieldPropTypeShape } from "../../Classes/Entity.js";

const ColoredTableRow = styled(TableRow)(({ isSelected, theme, themeColor }) => ({
    "&:hover": {
        backgroundColor: isSelected ? theme.palette[themeColor].translucent : theme.palette.grey.veryTranslucent

    },
    "&:not(:hover)": {
        backgroundColor: isSelected ? theme.palette[themeColor].veryTranslucent : ""
    }
}));

const DataTableRow = ({ rowSelectionEnabled, tableFields, isSelected, themeColor, smallCheckboxes }) => {
    const { inView, ref } = useInView({
        triggerOnce: true
    });

    const item = useTableRowItem();
    const [selectedItems, setSelectedItems] = useTableSelectedItems();

    const managementCallbacks = useTableRowManagementCallbacks();

    const handleCheckboxChange = useCallback((e) => {
        if (e.target.checked) {
            setSelectedItems([...selectedItems, item]);
        } else {
            setSelectedItems(selectedItems.filter((si) => si.id !== item.id));
        }
    }, [item, selectedItems, setSelectedItems]);

    return (
        <ColoredTableRow ref={ref}>
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
                            tableFields={tableFields}
                        />
                    )
                    : (
                        <TableRowPlaceholder colSpan={tableFields.length} />
                    )
            }
        </ColoredTableRow>
    );
};

DataTableRow.propTypes = {
    isSelected: PropTypes.bool,
    rowSelectionEnabled: PropTypes.bool,
    smallCheckboxes: PropTypes.string,
    tableFields: PropTypes.arrayOf(tableFieldPropTypeShape),
    themeColor: PropTypes.string
};

export default DataTableRow;
