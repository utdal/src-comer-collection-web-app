import React from "react";
import { useTableRowItem } from "../../../ContextProviders/TableRowProvider.js";
import { Typography } from "@mui/material";

export const TagIDCell = () => {
    const tag = useTableRowItem();
    return (
        <Typography variant="body1">
            {tag.id}
        </Typography>
    );
};
