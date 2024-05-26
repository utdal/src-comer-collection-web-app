import React from "react";
import { Typography } from "@mui/material";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider.js";

export const ExhibitionIDCell = () => {
    const exhibition = useTableCellItem();
    return (
        <Typography variant="body1">
            {exhibition.id}
        </Typography>
    );
};
