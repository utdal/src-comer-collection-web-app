import React from "react";
import { useTableRowItem } from "../../../ContextProviders/TableRowProvider.js";
import { Typography } from "@mui/material";
import { Entity } from "../../../Classes/Entity.js";

export const ExhibitionDateCreatedCell = () => {
    const exhibition = useTableRowItem();
    return (
        <Typography variant="body1">
            {Entity.formatDate(exhibition.date_created)}
            ,

            {" "}

            {Entity.formatTime(exhibition.date_created)}
        </Typography>
    );
};
