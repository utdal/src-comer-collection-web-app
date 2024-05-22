import { Stack, Typography } from "@mui/material";
import React from "react";
import PropTypes from "prop-types";

export const ExhibitionOption = ({ description, children, vertical }) => {
    return (
        <Stack
            alignItems={vertical ? "" : "center"}
            direction={vertical ? "column" : "row"}
            justifyContent="space-between"
            spacing={1}
        >
            <Typography variant="body1">
                {description}
            </Typography>

            {children}
        </Stack>
    );
};
ExhibitionOption.propTypes = {
    children: PropTypes.node.isRequired,
    description: PropTypes.string.isRequired,
    vertical: PropTypes.bool.isRequired
};
