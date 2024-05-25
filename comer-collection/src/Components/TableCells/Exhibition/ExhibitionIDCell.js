import React from "react";
import { useTableRowItemOld } from "../../../ContextProviders/TableRowProvider.js";
import { Typography } from "@mui/material";

export const ExhibitionIDCell = () => {
    const exhibition = useTableRowItemOld();
    return (
        <Typography variant="body1">
            {exhibition.id}
        </Typography>
    );
};
