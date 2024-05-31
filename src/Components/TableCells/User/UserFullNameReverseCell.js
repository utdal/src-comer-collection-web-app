import React from "react";
import { Typography } from "@mui/material";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider.js";

export const UserFullNameReverseCell = () => {
    const user = useTableCellItem();
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
