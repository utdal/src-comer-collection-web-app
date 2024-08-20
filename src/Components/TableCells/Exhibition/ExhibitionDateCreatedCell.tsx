import React from "react";
import { Typography } from "@mui/material";
import { formatDate, formatTime } from "../../../Classes/Entity";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider";
import type { ExhibitionItem } from "../../../index.js";

const ExhibitionDateCreatedCell = (): React.JSX.Element => {
    const exhibition = useTableCellItem() as ExhibitionItem;
    return (
        <Typography>
            {formatDate(exhibition.date_created)}
            ,

            {" "}

            {formatTime(exhibition.date_created)}
        </Typography>
    );
};

export default ExhibitionDateCreatedCell;
