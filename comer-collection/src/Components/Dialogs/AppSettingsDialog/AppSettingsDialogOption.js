import React from "react";
import { Stack, DialogContentText } from "@mui/material";
import PropTypes from "prop-types";

export const AppSettingsDialogOption = ({ description, children }) => {
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
AppSettingsDialogOption.propTypes = {
    children: PropTypes.node.isRequired,
    description: PropTypes.string.isRequired
};
