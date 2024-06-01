import React from "react";
import { Typography } from "@mui/material";
import { formatDate, formatTime } from "../../../Classes/Entity";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider";
import type { ExhibitionItem } from "../../..";

const ExhibitionDateModifiedCell = (): React.JSX.Element => {
    const exhibition = useTableCellItem() as ExhibitionItem;
    return (
        <Typography>
            {formatDate(exhibition.date_modified)}
            ,

            {" "}

            {formatTime(exhibition.date_modified)}
        </Typography>
    );
};

export default ExhibitionDateModifiedCell;
