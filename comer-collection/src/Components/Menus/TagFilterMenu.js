import React from "react";
import { Typography } from "@mui/material";
import { SellIcon } from "../../Imports/Icons.js";
import PropTypes from "prop-types";
import { SecondaryFilterMenu } from "./SecondaryFilterMenu.js";
import { entityPropTypeShape } from "../../Classes/Entity.js";

const tagSortFunction = (a, b) => {
    return a.data > b.data;
};

const tagDisplayFunction = (tag) => {
    return (
        <Typography
            sx={{ minWidth: "120px", maxWidth: "200px", wordWrap: "break-word" }}
            variant="body1"
        >
            {tag.data}
        </Typography>
    );
};

export const TagFilterMenu = ({ filterValue, setFilterValue, tags }) => {
    return (
        <SecondaryFilterMenu
            SecondaryIcon={SellIcon}
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
    tags: PropTypes.arrayOf(PropTypes.shape(entityPropTypeShape)).isRequired
};
