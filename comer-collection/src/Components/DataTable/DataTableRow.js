import React, { memo, useCallback } from "react";
import PropTypes from "prop-types";
import { useInView } from "react-intersection-observer";
import { Checkbox, TableCell, TableRow, styled } from "@mui/material";
import { DataTableFieldCells } from "./DataTableFieldCells.js";
import { DataTableRowPlaceholder } from "./DataTableRowPlaceholder.js";
import { entityPropTypeShape, tableFieldPropTypeShape } from "../../Classes/Entity.js";

/**
 * @typedef {import("../../ContextProviders/ManagementPageProvider.js").ItemDictionaryEntry} ItemDictionaryEntry
 */

const ColoredTableRow = styled(TableRow, {
    shouldForwardProp: (prop) => !["themeColor", "isSelected"].includes(prop)
})(({ isSelected, theme, themeColor }) => ({
    "&:hover": {
        backgroundColor: isSelected ? theme.palette[themeColor].translucent : theme.palette.grey.veryTranslucent

    },
    "&:not(:hover)": {
        backgroundColor: isSelected ? theme.palette[themeColor].veryTranslucent : ""
    }
}));

/**
 * @type {(props: {
 *      isSelected: boolean,
 *      themeColor: string
 * }) => React.JSX.Element}
 */
const DataTableRow = memo(function DataTableRow ({ itemDictionaryEntry, isSelected, themeColor, managementCallbacks, tableFields, rowSelectionEnabled, smallCheckboxes, setItemSelectionStatus }) {
    const { inView, ref } = useInView({
        triggerOnce: true
    });

    /**
     * @type {(newStatus: boolean) => void}
     */
    const setSelectionStatus = useCallback((newStatus) => {
        setItemSelectionStatus(itemDictionaryEntry.item.id, newStatus);
    }, [itemDictionaryEntry, setItemSelectionStatus]);

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
                        <DataTableRowPlaceholder
                            colSpan={tableFields.length + (rowSelectionEnabled ? 1 : 0)}
                        />
                    )
            }
        </ColoredTableRow>
    );
});

DataTableRow.propTypes = {
    isSelected: PropTypes.bool,
    itemDictionaryEntry: PropTypes.shape({
        item: entityPropTypeShape,
        itemString: PropTypes.string
    }),
    managementCallbacks: PropTypes.objectOf(PropTypes.func),
    rowSelectionEnabled: PropTypes.bool,
    setItemSelectionStatus: PropTypes.func,
    smallCheckboxes: PropTypes.bool,
    tableFields: PropTypes.arrayOf(tableFieldPropTypeShape).isRequired,
    themeColor: PropTypes.string
};

export default DataTableRow;
