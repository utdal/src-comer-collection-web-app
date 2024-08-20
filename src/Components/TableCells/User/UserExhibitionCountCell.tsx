import React from "react";
import { Button, Stack, Typography } from "@mui/material";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider";

import { PhotoCameraBackIcon } from "../../../Imports/Icons";
import type { ExhibitionItem, UserItem } from "../../..";

const UserExhibitionCountCell = (): React.JSX.Element => {
    const user = useTableCellItem() as UserItem;
    // const { handleOpenViewUserExhibitionDialog } = useTableCellManagementCallbacks();
    // const handleOpenViewExhibitionDialog = useCallback(() => {
    //     handleOpenViewUserExhibitionDialog(user);
    // }, [handleOpenViewUserExhibitionDialog, user]);
    return (
        <Stack
            direction="row"
            spacing={1}
        >
            <Button
                // onClick={handleOpenViewExhibitionDialog}
                startIcon={<PhotoCameraBackIcon />}
                sx={{ textTransform: "unset" }}
                variant="text"
            >
                <Typography variant="body1">
                    {(user.Exhibitions as ExhibitionItem[]).length}

                    {" "}
                    of

                    {" "}

                    {user.exhibition_quota}
                </Typography>
            </Button>
        </Stack>
    );
};

export default UserExhibitionCountCell;
