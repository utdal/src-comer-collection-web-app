import React from "react";
import { CourseEditButton } from "./CourseEditButton.js";
import { CourseDeleteButton } from "./CourseDeleteButton.js";

export const CourseOptionsCell = () => {
    return (
        <>
            <CourseEditButton />

            <CourseDeleteButton />
        </>
    );
};
