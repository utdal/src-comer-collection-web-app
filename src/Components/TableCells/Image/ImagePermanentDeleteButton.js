import React from "react";
import { EntityManagePermanentDeleteButton } from "../Entity/EntityManagePermanentDeleteButton.js";
import { useAppUser } from "../../../Hooks/useAppUser.js";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider.js";

export const ImagePermanentDeleteButton = () => {
    const appUser = useAppUser();
    const image = useTableCellItem();
    return appUser?.is_admin
        ? (
            <EntityManagePermanentDeleteButton
                disabled={image.Exhibitions?.length}
            />
        )
        : null;
};
