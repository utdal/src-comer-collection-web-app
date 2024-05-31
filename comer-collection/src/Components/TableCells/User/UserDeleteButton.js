import React from "react";
import { useAppUser } from "../../../Hooks/useAppUser.js";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider.js";
import EntityDeleteButton from "../Entity/EntityDeleteButton.js";

const UserDeleteButton = () => {
    const user = useTableCellItem();
    const appUser = useAppUser();
    const disabled = Boolean(user.Courses.length || user.Exhibitions.length || user.id === appUser.id);
    return (
        <EntityDeleteButton
            disabled={disabled}
        />
    );
};

export default UserDeleteButton;
