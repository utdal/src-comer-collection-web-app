import React from "react";
import { Stack } from "@mui/material";
import { TagManageEditButton } from "./TagManageEditButton.js";
import { TagManageDeleteButton } from "./TagManageDeleteButton.js";

const TagManageOptionsArray = () => {
    return (
        <Stack direction="row">
            <TagManageEditButton />

            <TagManageDeleteButton />
        </Stack>
    );
};

export default TagManageOptionsArray;
