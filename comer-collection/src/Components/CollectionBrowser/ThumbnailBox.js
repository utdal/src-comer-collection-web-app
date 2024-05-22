import { Box } from "@mui/material";
import React from "react";
import PropTypes from "prop-types";
import { InView } from "react-intersection-observer";

export const ThumbnailBox = ({ image }) => (
    <InView triggerOnce>
        {({ inView, ref }) => (
            <Box
                height="150px"
                ref={ref}
                sx={{
                    backgroundImage: inView ? `url(${`http://localhost:9000/api/public/images/${image.id}/download`})` : "none",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "contain",
                    backgroundPositionX: "center",
                    backgroundPositionY: "top"
                }}
                width="200px"
            />
        )}
    </InView>
);
ThumbnailBox.propTypes = {
    image: PropTypes.shape({
        id: PropTypes.number
    }).isRequired
};
