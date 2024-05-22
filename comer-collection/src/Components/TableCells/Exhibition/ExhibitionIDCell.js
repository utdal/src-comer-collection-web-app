import React from "react";
import { useTableRowItem } from "../../../ContextProviders/TableRowProvider.js";
import { Typography } from "@mui/material";

export const ExhibitionIDCell = () => {
    const exhibition = useTableRowItem();
    return (
        <Typography variant="body1">
            {exhibition.id}
        </Typography>
    );
};
