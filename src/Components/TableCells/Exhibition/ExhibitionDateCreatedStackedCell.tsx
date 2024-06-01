import React from "react";
import { Stack, Typography } from "@mui/material";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider";
import type { ExhibitionItem } from "../../..";
import { formatDate, formatTime } from "../../../Classes/Entity";

const ExhibitionDateCreatedStackedCell = (): React.JSX.Element => {
    const exhibition = useTableCellItem() as ExhibitionItem;
    return (
        <Stack
            direction="column"
            padding={0}
        >
            <Typography>
                {formatDate(exhibition.date_created)}
            </Typography>

            <Typography>
                {formatTime(exhibition.date_created)}
            </Typography>
        </Stack>
    );
};

export default ExhibitionDateCreatedStackedCell;
