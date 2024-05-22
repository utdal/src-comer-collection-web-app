import React from "react";
import { useTableRowItem } from "../../../ContextProviders/TableRowProvider.js";
import { EntityManageDeleteButton } from "../Entity/EntityManageDeleteButton.js";

export const ArtistManageDeleteButton = () => {
    const artist = useTableRowItem();
    return (
        <EntityManageDeleteButton
            disabled={artist.Images.length > 0}
        />
    );
};
