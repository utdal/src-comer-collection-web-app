import { Box } from "@mui/material";
import React from "react";
import { InView } from "react-intersection-observer";
import type { ImageItem } from "../..";

const CollectionGalleryThumbnailBox = ({ image }: {
    readonly image: ImageItem;
}): React.JSX.Element => (
    <InView triggerOnce>
        {({ inView, ref }): React.ReactNode => (
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

export default CollectionGalleryThumbnailBox;
