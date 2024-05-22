import React from "react";
import { ImageEditButton } from "./ImageEditButton.js";
import { ImageDeleteButton } from "./ImageDeleteButton.js";

export const ImageOptionsCell = () => {
    return (
        <>
            <ImageEditButton />

            <ImageDeleteButton />
        </>
    );
};
