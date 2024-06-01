import React from "react";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider";
import type { ArtistItem, ImageItem } from "../../../index.js";
import EntityDeleteButton from "../Entity/EntityDeleteButton";

const ArtistManageDeleteButton = (): React.JSX.Element => {
    const artist = useTableCellItem() as ArtistItem;
    return (
        <EntityDeleteButton
            disabled={(artist.Images as ImageItem[]).length > 0}
        />
    );
};

export default ArtistManageDeleteButton;
