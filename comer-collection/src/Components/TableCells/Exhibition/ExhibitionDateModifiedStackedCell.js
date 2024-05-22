import React from "react";
import { useTableRowItem } from "../../../ContextProviders/TableRowProvider.js";
import { Stack, Typography } from "@mui/material";
import { Exhibition } from "../../../Classes/Entities/Exhibition.js";

export const ExhibitionDateModifiedStackedCell = () => {
    const exhibition = useTableRowItem();
    return (
        <Stack
            direction="column"
            padding={0}
        >
            <Typography variant="body1">
                {Exhibition.formatDate(exhibition.date_modified)}
            </Typography>

            <Typography variant="body1">
                {Exhibition.formatTime(exhibition.date_modified)}
            </Typography>
        </Stack>
    );
};
