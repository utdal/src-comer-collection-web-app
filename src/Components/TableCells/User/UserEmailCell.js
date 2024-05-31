import React from "react";
import { Typography } from "@mui/material";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider.js";

export const UserEmailCell = () => {
    const user = useTableCellItem();
    return (
        <Typography
            color="grey"
            variant="body1"
        >
            {user.email}
        </Typography>
    );
};
