import React, { memo } from "react";
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

export default memo(DataTableRowPlaceholder);
