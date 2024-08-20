import React from "react";
import ImageEditButton from "./ImageEditButton";
import ImageDeleteButton from "./ImageDeleteButton";

const ImageOptionsCell = (): React.JSX.Element => {
    return (
        <>
            <ImageEditButton />

            <ImageDeleteButton />
        </>
    );
};

export default ImageOptionsCell;
