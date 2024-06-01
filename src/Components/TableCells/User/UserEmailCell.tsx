import React from "react";
import { Typography } from "@mui/material";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider";
import type { UserItem } from "../../..";

const UserEmailCell = (): React.JSX.Element => {
    const user = useTableCellItem() as UserItem;
    return (
        <Typography
            color="grey"
            variant="body1"
        >
            {user.email}
        </Typography>
    );
};

export default UserEmailCell;
