import React from "react";
import { Stack, Typography } from "@mui/material";
import { useTableRowItem } from "../../../ContextProviders/TableRowProvider.js";
import { PhotoCameraBackIcon } from "../../../Imports/Icons.js";

export const UserExhibitionQuotaCell = () => {
    const user = useTableRowItem();
    return (
        <Stack
            direction="row"
            spacing={1}
        >
            <PhotoCameraBackIcon />

            <Typography variant="body1">
                {user.Exhibitions.length}

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
