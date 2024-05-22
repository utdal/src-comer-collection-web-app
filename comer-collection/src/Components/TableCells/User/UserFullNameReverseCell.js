import React from "react";
import { Typography } from "@mui/material";
import { useTableRowItem } from "../../../ContextProviders/TableRowProvider.js";

export const UserFullNameReverseCell = () => {
    const user = useTableRowItem();
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
