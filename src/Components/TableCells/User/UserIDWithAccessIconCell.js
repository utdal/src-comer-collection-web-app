import React from "react";
import { Stack, Typography } from "@mui/material";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider.js";
import { CollectionManagerIcon, SecurityIcon } from "../../../Imports/Icons.js";

export const UserIDWithAccessIconCell = () => {
    const user = useTableCellItem();
    return (
        <Stack
            alignItems="center"
            direction="row"
            spacing={1}
        >
            <Typography variant="body1">
                {user.id}

                {" "}
            </Typography>

            {
                (user.is_admin && <SecurityIcon color="secondary" />) ||
                (user.is_collection_manager && <CollectionManagerIcon color="secondary" />)
            }
        </Stack>
    );
};
