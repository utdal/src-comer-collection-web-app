import React from "react";
import { Typography } from "@mui/material";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider.js";

export const TagNotesCell = () => {
    const tag = useTableCellItem();
    return (tag.notes &&
        <Typography variant="body1">
            {tag.notes}
        </Typography>
    ) || (!tag.notes &&
        <Typography
            sx={{ opacity: 0.5 }}
            variant="body1"
        />
    );
};
