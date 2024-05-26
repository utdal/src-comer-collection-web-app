import React from "react";
import { Stack, Typography } from "@mui/material";
import { Exhibition } from "../../../Classes/Entities/Exhibition.js";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider.js";

export const ExhibitionDateCreatedStackedCell = () => {
    const exhibition = useTableCellItem();
    return (
        <Stack
            direction="column"
            padding={0}
        >
            <Typography variant="body1">
                {Exhibition.formatDate(exhibition.date_created)}
            </Typography>

            <Typography variant="body1">
                {Exhibition.formatTime(exhibition.date_created)}
            </Typography>
        </Stack>
    );
};
