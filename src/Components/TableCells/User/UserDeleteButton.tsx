import React from "react";
import useAppUser from "../../../Hooks/useAppUser";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider";
import EntityDeleteButton from "../Entity/EntityDeleteButton";
import type { AppUser, CourseItem, ExhibitionItem, UserItem } from "../../../index.js";

const UserDeleteButton = (): React.JSX.Element => {
    const user = useTableCellItem() as UserItem;
    const appUser = useAppUser() as AppUser;
    const disabled = Boolean((user.Courses as CourseItem[]).length || (user.Exhibitions as ExhibitionItem[]).length || user.id === appUser.id);
    return (
        <EntityDeleteButton
            disabled={disabled}
        />
    );
};

export default UserDeleteButton;
