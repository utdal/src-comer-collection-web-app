import React from "react";
import { Typography } from "@mui/material";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider";
import type { UserItem } from "../../..";

const UserFullNameReverseCell = (): React.JSX.Element => {
    const user = useTableCellItem() as UserItem;
    return (
        user.has_name
            ? (
                <Typography variant="body1">
                    {user.full_name_reverse}
                </Typography>
            )
            : (
                <Typography
                    sx={{ opacity: 0.5 }}
                    variant="body1"
                >
                    Not set
                </Typography>
            )
    );
};

export default UserFullNameReverseCell;
