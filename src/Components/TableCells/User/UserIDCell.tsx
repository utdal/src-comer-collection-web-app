import React from "react";
import { Stack, Typography } from "@mui/material";
import useAppUser from "../../../Hooks/useAppUser";
import { PersonIcon } from "../../../Imports/Icons";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider";
import type { AppUser, UserItem } from "../../../index.js";

const UserIDCell = (): React.JSX.Element => {
    const user = useTableCellItem() as UserItem;
    const appUser = useAppUser() as AppUser;
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

export default UserIDCell;
