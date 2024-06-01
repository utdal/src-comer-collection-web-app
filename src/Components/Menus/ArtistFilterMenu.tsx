import React from "react";
import { BrushIcon } from "../../Imports/Icons.js";
import { SecondaryFilterMenu } from "./SecondaryFilterMenu.js";
import { Typography } from "@mui/material";
import type { ArtistItem, Item } from "../../index.js";

const artistSortFunction = (a: Item, b: Item): number => {
    return (a as ArtistItem).fullNameReverse > (b as ArtistItem).fullNameReverse ? 1 : -1;
};

const artistDisplayFunction = (artist: Item): React.ReactNode => {
    return (
        <Typography
            sx={{ minWidth: "120px", maxWidth: "200px", wordWrap: "break-word" }}
            variant="body1"
        >
            {(artist as ArtistItem).fullNameReverse}
        </Typography>
    );
};

export const ArtistFilterMenu = ({ filterValue, setFilterValue, artists }: {
    readonly filterValue: ArtistItem | null;
    readonly setFilterValue: React.Dispatch<React.SetStateAction<Item | null>>;
    readonly artists: ArtistItem[];
}): React.JSX.Element => {
    return (
        <SecondaryFilterMenu
            SecondaryIcon={BrushIcon as React.ElementType}
            displayFunction={artistDisplayFunction}
            emptyMessage="No artist filters available"
            filterValue={filterValue}
            helpMessage="Filter images by artist"
            nullMessage="Do not filter by artist"
            secondaries={artists}
            setFilterValue={setFilterValue}
            sortFunction={artistSortFunction}
        />
    );
};
