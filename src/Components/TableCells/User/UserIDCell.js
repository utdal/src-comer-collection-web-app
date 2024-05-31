import React from "react";
import { Stack, Typography } from "@mui/material";
import { useAppUser } from "../../../Hooks/useAppUser.ts";
import { PersonIcon } from "../../../Imports/Icons.js";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider.js";

export const UserIDCell = () => {
    const user = useTableCellItem();
    const appUser = useAppUser();
    return (
        <Stack
            alignItems="center"
            direction="row"
            spacing={1}
        >
            <Typography variant="body1">
                {user.id}
            </Typography>

            {user.id === appUser.id && (
                <PersonIcon color="secondary" />
            )}
        </Stack>
    );
};
