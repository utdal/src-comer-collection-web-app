import { Divider, Typography } from "@mui/material";
import React from "react";
import { useTheme } from "@emotion/react";
import PropTypes from "prop-types";

export const AccordionSubHeading = ({ text }) => {
    const theme = useTheme();
    return (
        <>
            <Divider />

            <Typography
                align="center"
                color={theme.palette.grey.main}
                variant="h6"
            >
                {text}
            </Typography>
        </>
    );
};
AccordionSubHeading.propTypes = {
    text: PropTypes.string.isRequired
};
