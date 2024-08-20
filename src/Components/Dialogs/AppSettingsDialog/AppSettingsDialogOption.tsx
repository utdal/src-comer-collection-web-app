import React from "react";
import { Stack, DialogContentText } from "@mui/material";

const AppSettingsDialogOption = ({ description, children }: {
    readonly description: string;
    readonly children: React.ReactNode;
}): React.JSX.Element => {
    return (
        <Stack
            alignItems="center"
            direction="row"
            justifyContent="space-between"
        >
            <DialogContentText variant="body1">
                {description}
            </DialogContentText>

            {children}
        </Stack>
    );
};

export default AppSettingsDialogOption;
