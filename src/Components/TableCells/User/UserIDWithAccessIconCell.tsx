import React from "react";
import { Stack, Typography } from "@mui/material";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider";
import { CollectionManagerIcon, SecurityIcon } from "../../../Imports/Icons";
import type { UserItem } from "../../..";

const UserIDWithAccessIconCell = (): React.JSX.Element => {
    const user = useTableCellItem() as UserItem;
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
                user.is_admin
                    ? (
                        <SecurityIcon color="secondary" />
                    )
                    : user.is_collection_manager
                        ? (
                            <CollectionManagerIcon color="secondary" />
                        )
                        : null
            }
        </Stack>
    );
};

export default UserIDWithAccessIconCell;
