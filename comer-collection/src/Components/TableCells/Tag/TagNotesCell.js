import React from "react";
import { useTableRowItem } from "../../../ContextProviders/TableRowProvider.js";
import { Typography } from "@mui/material";

export const TagNotesCell = () => {
    const tag = useTableRowItem();
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
