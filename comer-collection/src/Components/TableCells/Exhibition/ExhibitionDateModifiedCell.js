import React from "react";
import { useTableRowItem } from "../../../ContextProviders/TableRowProvider.js";
import { Typography } from "@mui/material";
import { Entity } from "../../../Classes/Entity";

export const ExhibitionDateModifiedCell = () => {
    const exhibition = useTableRowItem();
    return (
        <Typography variant="body1">
            {Entity.formatDate(exhibition.date_modified)}
            ,

            {" "}

            {Entity.formatTime(exhibition.date_modified)}
        </Typography>
    );
};
