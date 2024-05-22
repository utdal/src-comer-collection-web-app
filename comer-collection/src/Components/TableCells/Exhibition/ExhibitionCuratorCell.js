import React from "react";
import { useTableRowItem } from "../../../ContextProviders/TableRowProvider.js";
import { Typography } from "@mui/material";

export const ExhibitionCuratorCell = () => {
    const exhibition = useTableRowItem();
    return (
        <Typography variant="body1">
            {exhibition.curator}
        </Typography>
    );
};
