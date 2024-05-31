import React, { useCallback } from "react";
import { Button, Stack, Typography } from "@mui/material";
import { useAppUser } from "../../../Hooks/useAppUser.ts";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider.js";
import { useNavigate } from "react-router";

export const UserProfilePasswordInfoCell = () => {
    const user = useTableCellItem();
    const appUser = useAppUser();
    const navigate = useNavigate();
    const handleNavigateToChangePassword = useCallback(() => {
        navigate("/Account/ChangePassword");
    }, [navigate]);
    return (
        <Stack
            alignItems="center"
            direction="row"
            spacing={2}
        >
            <Typography variant="body1">
                {new Date(appUser.pw_updated).toLocaleString()}
            </Typography>

            <Button
                color={user.is_admin_or_collection_manager ? "secondary" : "primary"}
                onClick={handleNavigateToChangePassword}
                variant="outlined"
            >
                <Typography variant="body1">
                    Change
                </Typography>
            </Button>
        </Stack>
    );
};
