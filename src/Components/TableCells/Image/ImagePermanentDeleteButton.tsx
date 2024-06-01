import React from "react";
import { useAppUser } from "../../../Hooks/useAppUser";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider";
import type { AppUser, ExhibitionItem, ImageItem } from "../../../index.js";
import PermanentDeleteButton from "../Entity/PermanentDeleteButton";

const ImagePermanentDeleteButton = (): React.JSX.Element => {
    const appUser = useAppUser() as AppUser;
    const image = useTableCellItem() as ImageItem;
    return (
        <PermanentDeleteButton
            disabled={!appUser.is_admin || (image.Exhibitions as ExhibitionItem[]).length > 0}
        />
    );
};

export default ImagePermanentDeleteButton;
