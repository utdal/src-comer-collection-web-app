import React from "react";
import { EntityManageDeleteButton } from "../Entity/EntityManageDeleteButton.js";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider.js";

export const ArtistManageDeleteButton = () => {
    const artist = useTableCellItem();
    return (
        <EntityManageDeleteButton
            disabled={artist.Images.length > 0}
        />
    );
};
