import { Box } from "@mui/material";
import React from "react";
import PropTypes from "prop-types";
import { InView } from "react-intersection-observer";

export const CollectionGalleryThumbnailBox = ({ image }) => (
    <InView triggerOnce>
        {({ inView, ref }) => (
            <Box
                height="150px"
                ref={ref}
                sx={{
                    backgroundImage: inView ? `url(${`http://localhost:9000/api/images/${image.id}/download`})` : "none",
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
CollectionGalleryThumbnailBox.propTypes = {
    image: PropTypes.shape({
        id: PropTypes.number
    }).isRequired
};
