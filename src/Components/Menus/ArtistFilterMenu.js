import React from "react";
import { BrushIcon } from "../../Imports/Icons.js";
import PropTypes from "prop-types";
import { SecondaryFilterMenu } from "./SecondaryFilterMenu.js";
import { Typography } from "@mui/material";
import { entityPropTypeShape } from "../../Classes/Entity.ts";

const artistSortFunction = (a, b) => {
    return a.fullNameReverse > b.fullNameReverse;
};

const artistDisplayFunction = (artist) => {
    return (
        <Typography
            sx={{ minWidth: "120px", maxWidth: "200px", wordWrap: "break-word" }}
            variant="body1"
        >
            {artist.fullNameReverse}
        </Typography>
    );
};

export const ArtistFilterMenu = ({ filterValue, setFilterValue, artists }) => {
    return (
        <SecondaryFilterMenu
            SecondaryIcon={BrushIcon}
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

ArtistFilterMenu.propTypes = {
    artists: PropTypes.arrayOf(entityPropTypeShape).isRequired,
    filterValue: PropTypes.shape(entityPropTypeShape).isRequired,
    setFilterValue: PropTypes.func.isRequired
};
