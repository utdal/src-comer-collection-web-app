import React from "react";
import { Typography } from "@mui/material";
import { Entity } from "../../../Classes/Entity.js";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider.js";

export const ExhibitionDateCreatedCell = () => {
    const exhibition = useTableCellItem();
    return (
        <Typography variant="body1">
            {Entity.formatDate(exhibition.date_created)}
            ,

            {" "}

            {Entity.formatTime(exhibition.date_created)}
        </Typography>
    );
};
