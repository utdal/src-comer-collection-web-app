import React from "react";
import { Typography } from "@mui/material";
import { SellIcon } from "../../Imports/Icons.js";
import PropTypes from "prop-types";
import { SecondaryFilterMenu } from "./SecondaryFilterMenu.js";
import { entityPropTypeShape } from "../../Classes/Entity.js";
import type { Item, TagItem } from "../../index.js";

const tagSortFunction = (a: Item, b: Item): number => {
    return (a as TagItem).data > (b as TagItem).data ? 1 : -1;
};

const tagDisplayFunction = (tag: Item): React.ReactNode => {
    return (
        <Typography
            sx={{ minWidth: "120px", maxWidth: "200px", wordWrap: "break-word" }}
            variant="body1"
        >
            {(tag as TagItem).data}
        </Typography>
    );
};

export const TagFilterMenu = ({ filterValue, setFilterValue, tags }: {
    readonly filterValue: TagItem | null;
    readonly setFilterValue: React.Dispatch<React.SetStateAction<Item | null>>;
    readonly tags: TagItem[];
}): React.JSX.Element => {
    return (
        <SecondaryFilterMenu
            SecondaryIcon={SellIcon as React.ElementType}
            displayFunction={tagDisplayFunction}
            emptyMessage="No tag filters available"
            filterValue={filterValue}
            helpMessage="Filter images by tag"
            nullMessage="Do not filter by tag"
            secondaries={tags}
            setFilterValue={setFilterValue}
            sortFunction={tagSortFunction}
        />
    );
};

TagFilterMenu.propTypes = {
    filterValue: PropTypes.arrayOf(entityPropTypeShape).isRequired,
    setFilterValue: PropTypes.func.isRequired,
    tags: PropTypes.arrayOf(entityPropTypeShape).isRequired
};
