import React from "react";
import { EntityManageDeleteButton } from "../Entity/EntityManageDeleteButton.js";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider";
import type { ArtistItem, ImageItem } from "../../../index.js";

const ArtistManageDeleteButton = (): React.JSX.Element => {
    const artist = useTableCellItem() as ArtistItem;
    return (
        <EntityManageDeleteButton
            disabled={(artist.Images as ImageItem[]).length > 0}
        />
    );
};

export default ArtistManageDeleteButton;
