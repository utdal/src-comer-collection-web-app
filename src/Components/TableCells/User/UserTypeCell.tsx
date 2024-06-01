import React from "react";
import { Stack, Typography } from "@mui/material";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider";
import { CollectionManagerIcon, PersonIcon, SecurityIcon } from "../../../Imports/Icons.js";
import type { UserItem } from "../../..";

const UserTypeCell = (): React.JSX.Element => {
    const user = useTableCellItem() as UserItem;
    return (
        <Stack
            direction="row"
            spacing={1}
        >
            <Typography variant="body1">
                {user.is_admin ? "Administrator" : user.is_collection_manager ? "Collection Manager" : "Curator"}
            </Typography>

            {user.is_admin ? (<SecurityIcon color="secondary" />) : user.is_collection_manager ? (<CollectionManagerIcon color="secondary" />) : (<PersonIcon color="primary" />)}
        </Stack>
    );
};

export default UserTypeCell;
