import React from "react";
import { Stack, Typography } from "@mui/material";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider";
import type { ExhibitionItem, UserItem } from "../../../index.js";

const ExhibitionOwnerStackedNameEmailCell = (): React.JSX.Element => {
    const exhibition = useTableCellItem() as ExhibitionItem;
    const owner = exhibition.User as UserItem;
    return (
        <Stack
            direction="column"
            paddingBottom={1}
            paddingTop={1}
        >
            <Typography variant="body1">
                {owner.full_name_reverse}
            </Typography>

            <Typography
                sx={{ opacity: 0.5 }}
                variant="body1"
            >
                {owner.email}
            </Typography>
        </Stack>
    );
};

export default ExhibitionOwnerStackedNameEmailCell;
