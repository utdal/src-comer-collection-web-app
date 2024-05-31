import React from "react";
import CourseEditButton from "./CourseEditButton.js";
import CourseDeleteButton from "./CourseDeleteButton.js";

const CourseOptionsCell = () => {
    return (
        <>
            <CourseEditButton />

            <CourseDeleteButton />
        </>
    );
};

export default CourseOptionsCell;
