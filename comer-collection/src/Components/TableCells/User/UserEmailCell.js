import React from "react";
import { Typography } from "@mui/material";
import { useTableRowItem } from "../../../ContextProviders/TableRowProvider.js";

export const UserEmailCell = () => {
    const user = useTableRowItem();
    return (
        <Typography
            color="grey"
            variant="body1"
        >
            {user.email}
        </Typography>
    );
};
