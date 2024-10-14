import React, { useCallback } from "react";
import { Button, Typography } from "@mui/material";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider";
import { useClipboard } from "../../../ContextProviders/AppFeatures";
import type { UserItem } from "../../..";

const UserEmailCopyCell = (): React.JSX.Element => {
    const user = useTableCellItem() as UserItem;
    const clipboard = useClipboard();
    const handleCopyToClipboard = useCallback(() => {
        clipboard(user.email);
    }, [clipboard, user.email]);
    return (
        <Button
            color="inherit"
            onClick={handleCopyToClipboard}
            sx={{ textTransform: "unset" }}
            variant="text"
        >
            <Typography
                color="gray"
                variant="body1"
            >
                {user.email}
            </Typography>
        </Button>
    );
};

export default UserEmailCopyCell;
