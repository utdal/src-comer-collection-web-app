import React from "react";
import UserEditButton from "./UserEditButton.js";
import UserDeleteButton from "./UserDeleteButton.js";

const UserOptionsCell = () => {
    return (
        <>
            <UserEditButton />

            <UserDeleteButton />
        </>
    );
};

export default UserOptionsCell;
