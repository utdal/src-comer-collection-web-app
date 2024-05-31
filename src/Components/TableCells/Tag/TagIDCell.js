import React from "react";
import { Typography } from "@mui/material";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider.js";

export const TagIDCell = () => {
    const tag = useTableCellItem();
    return (
        <Typography variant="body1">
            {tag.id}
        </Typography>
    );
};
