import React from "react";
import { Stack, Typography } from "@mui/material";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider";
import type { UserItem } from "../../..";

const UserStackedNameEmailCell = (): React.JSX.Element => {
    const user = useTableCellItem() as UserItem;
    return (
        <Stack
            direction="column"
            paddingBottom={1}
            paddingTop={1}
        >
            <Typography variant="body1">
                {user.full_name_reverse}
            </Typography>

            <Typography
                sx={{ opacity: 0.5 }}
                variant="body1"
            >
                {user.email}
            </Typography>
        </Stack>
    );
};

export default UserStackedNameEmailCell;
