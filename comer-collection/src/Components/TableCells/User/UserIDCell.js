import React from "react";
import { Stack, Typography } from "@mui/material";
import { useAppUser } from "../../../ContextProviders/AppUser.js";
import { useTableRowItem } from "../../../ContextProviders/TableRowProvider.js";
import { PersonIcon } from "../../../Imports/Icons.js";

export const UserIDCell = () => {
    const user = useTableRowItem();
    const [appUser] = useAppUser();
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
