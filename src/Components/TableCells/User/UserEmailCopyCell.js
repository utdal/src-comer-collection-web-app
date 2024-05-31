import React, { useCallback } from "react";
import { Button, Typography } from "@mui/material";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider.js";
import { useClipboard } from "../../../ContextProviders/AppFeatures.js";

export const UserEmailCopyCell = () => {
    const user = useTableCellItem();
    const clipboard = useClipboard();
    const handleCopyToClipboard = useCallback(() => {
        clipboard(user.email);
    }, [clipboard, user.email]);
    return (
        <Button
            color="grey"
            onClick={handleCopyToClipboard}
            sx={{ textTransform: "unset" }}
            variant="text"
        >
            <Typography variant="body1">
                {user.email}
            </Typography>
        </Button>
    );
};
