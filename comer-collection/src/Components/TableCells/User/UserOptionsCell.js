import React from "react";
import { UserEditButton } from "./UserEditButton.js";
import { UserDeleteButton } from "./UserDeleteButton.js";

export const UserOptionsCell = () => {
    return (
        <>
            <UserEditButton />

            <UserDeleteButton />
        </>
    );
};
