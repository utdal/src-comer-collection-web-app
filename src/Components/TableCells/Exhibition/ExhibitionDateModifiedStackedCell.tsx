import React from "react";
import { Stack, Typography } from "@mui/material";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider";
import { formatDate, formatTime } from "../../../Classes/Entity";
import type { ExhibitionItem } from "../../../index.js";

const ExhibitionDateModifiedStackedCell = (): React.JSX.Element => {
    const exhibition = useTableCellItem() as ExhibitionItem;
    return (
        <Stack
            direction="column"
            padding={0}
        >
            <Typography variant="body1">
                {formatDate(exhibition.date_modified)}
            </Typography>

            <Typography variant="body1">
                {formatTime(exhibition.date_modified)}
            </Typography>
        </Stack>
    );
};

export default ExhibitionDateModifiedStackedCell;
