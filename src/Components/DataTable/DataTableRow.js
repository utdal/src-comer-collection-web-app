import React, { memo, useCallback } from "react";
import PropTypes from "prop-types";
import { useInView } from "react-intersection-observer";
import { Checkbox, TableCell, TableRow, styled } from "@mui/material";
import { DataTableFieldCells } from "./DataTableFieldCells.js";
import { DataTableRowPlaceholder } from "./DataTableRowPlaceholder.js";
import { entityPropTypeShape, tableFieldPropTypeShape } from "../../Classes/Entity.ts";

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
 *      themeColor: string,
 *      noSkeleton: boolean
 * }) => React.JSX.Element}
 */
const DataTableRow = memo(function DataTableRow ({ item, isSelected, themeColor, managementCallbacks, tableFields, rowSelectionEnabled, smallCheckboxes, setItemSelectionStatus, noSkeleton }) {
    const { inView, ref } = useInView({
        triggerOnce: true
    });

    /**
     * @type {(newStatus: boolean) => void}
     */
    const setSelectionStatus = useCallback((newStatus) => {
        setItemSelectionStatus(item.id, newStatus);
    }, [item, setItemSelectionStatus]);

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
                inView || noSkeleton
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
});

DataTableRow.propTypes = {
    isSelected: PropTypes.bool,
    item: entityPropTypeShape,
    managementCallbacks: PropTypes.objectOf(PropTypes.func),
    noSkeleton: PropTypes.bool,
    rowSelectionEnabled: PropTypes.bool,
    setItemSelectionStatus: PropTypes.func,
    smallCheckboxes: PropTypes.bool,
    tableFields: PropTypes.arrayOf(tableFieldPropTypeShape).isRequired,
    themeColor: PropTypes.string
};

export default DataTableRow;
