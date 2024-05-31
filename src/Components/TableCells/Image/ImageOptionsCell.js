import React from "react";
import ImageEditButton from "./ImageEditButton.js";
import ImageDeleteButton from "./ImageDeleteButton.js";

const ImageOptionsCell = () => {
    return (
        <>
            <ImageEditButton />

            <ImageDeleteButton />
        </>
    );
};

export default ImageOptionsCell;
