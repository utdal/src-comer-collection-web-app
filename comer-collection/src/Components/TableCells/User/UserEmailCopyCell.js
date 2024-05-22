import React, { useCallback } from "react";
import { Button, Typography } from "@mui/material";
import { useTableRowItem } from "../../../ContextProviders/TableRowProvider.js";
import { useClipboard } from "../../../ContextProviders/AppFeatures.js";

export const UserEmailCopyCell = () => {
    const user = useTableRowItem();
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
