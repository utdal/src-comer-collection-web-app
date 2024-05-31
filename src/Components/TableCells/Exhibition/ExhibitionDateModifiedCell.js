import React from "react";
import { Typography } from "@mui/material";
import { Entity } from "../../../Classes/Entity.js";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider.js";

export const ExhibitionDateModifiedCell = () => {
    const exhibition = useTableCellItem();
    return (
        <Typography variant="body1">
            {Entity.formatDate(exhibition.date_modified)}
            ,

            {" "}

            {Entity.formatTime(exhibition.date_modified)}
        </Typography>
    );
};
