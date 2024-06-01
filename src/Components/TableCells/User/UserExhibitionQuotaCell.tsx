import React from "react";
import { Stack, Typography } from "@mui/material";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider";
import { PhotoCameraBackIcon } from "../../../Imports/Icons";
import type { ExhibitionItem, UserItem } from "../../..";

const UserExhibitionQuotaCell = (): React.JSX.Element => {
    const user = useTableCellItem() as UserItem;
    return (
        <Stack
            direction="row"
            spacing={1}
        >
            <PhotoCameraBackIcon />

            <Typography variant="body1">
                {(user.Exhibitions as ExhibitionItem[]).length}

                {" "}
                of

                {" "}

                {user.exhibition_quota}

                {" "}
            </Typography>

            <Typography
                color="gray"
                variant="body1"
            >
                {user.is_admin ? " (ignored for administrators)" : ""}
            </Typography>
        </Stack>
    );
};

export default UserExhibitionQuotaCell;
