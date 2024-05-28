import React from "react";
import PropTypes from "prop-types";
import { Stack } from "@mui/material";

const SideBySideLogo = ({ height = 150 }) => {
    const spacing = -height / 20;
    return (
        <Stack
            alignItems="center"
            direction="row"
            height={height}
            justifyContent="center"
            spacing={spacing}
        >
            <img
                height="100%"
                src="/images/logo_image_only_orange.png"
            />

            <img
                height="75%"
                src="/images/logo_text_only_orange.png"
            />
        </Stack>
    );
};

SideBySideLogo.propTypes = {
    height: PropTypes.number
};

export default SideBySideLogo;
