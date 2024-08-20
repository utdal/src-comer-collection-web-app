import React from "react";
import UserEditButton from "./UserEditButton";
import UserDeleteButton from "./UserDeleteButton";

const UserOptionsCell = (): React.JSX.Element => {
    return (
        <>
            <UserEditButton />

            <UserDeleteButton />
        </>
    );
};

export default UserOptionsCell;
