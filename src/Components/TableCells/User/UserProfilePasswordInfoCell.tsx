import React, { useCallback } from "react";
import { Button, Stack, Typography } from "@mui/material";
import { useAppUser } from "../../../Hooks/useAppUser";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider";
import { useNavigate } from "react-router";
import type { AppUser, UserItem } from "../../../index.js";

const UserProfilePasswordInfoCell = (): React.JSX.Element => {
    const user = useTableCellItem() as UserItem;
    const appUser = useAppUser() as AppUser;
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

export default UserProfilePasswordInfoCell;
