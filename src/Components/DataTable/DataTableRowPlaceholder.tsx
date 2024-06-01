import React, { memo } from "react";
import PropTypes from "prop-types";
import { TableCell, Skeleton } from "@mui/material";

const DataTableRowPlaceholder = ({ colSpan }: {
    readonly colSpan: number;
}): React.JSX.Element => {
    return (
        <TableCell
            colSpan={colSpan}
            size="medium"
        >
            <Skeleton
                height="20px"
                variant="text"
                width="100%"
            />
        </TableCell>
    );
};

DataTableRowPlaceholder.propTypes = {
    colSpan: PropTypes.number
};

export default memo(DataTableRowPlaceholder);
