import React from "react";
import { Stack } from "@mui/material";
import TagManageEditButton from "./TagManageEditButton";
import TagManageDeleteButton from "./TagManageDeleteButton";

const TagManageOptionsArray = (): React.JSX.Element => {
    return (
        <Stack direction="row">
            <TagManageEditButton />

            <TagManageDeleteButton />
        </Stack>
    );
};

export default TagManageOptionsArray;
