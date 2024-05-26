import { Box, Paper, Stack, ToggleButton, ToggleButtonGroup } from "@mui/material";
import React, { useMemo, useState } from "react";
import { GridOnIcon, ViewListIcon } from "../Imports/Icons.js";
import SearchBox from "./SearchBox.js";
import { doesItemMatchSearchQuery } from "../Helpers/SearchUtilities.js";
import PropTypes from "prop-types";
import { ManagementPageProvider, useItemsReducer } from "../ContextProviders/ManagementPageProvider.js";
import { entityPropTypeShape } from "../Classes/Entity.js";
import { CollectionBrowserImageContainer } from "../Pages/Browsers/CollectionBrowser.js";

const disabledImagesDefaultValue = [];

export const CollectionGalleryDisplay = ({ isDialogMode, selectedItem = null, setSelectedItem = null, images, disabledImages = disabledImagesDefaultValue }) => {
    const [viewMode, setViewMode] = useState("grid");

    const [imagesCombinedState, { setItems: setImages }] = useItemsReducer(images);

    const handleViewModeChange = (event, next) => {
        setViewMode(next);
    };

    const [searchQuery, setSearchQuery] = useState("");

    const renderedImageContainerData = useMemo(() => imagesCombinedState.items.map((image) => (
        [
            image,
            <CollectionBrowserImageContainer
                image={image}
                isDisabled={(disabledImages ?? []).map((di) => di.image_id).includes(image.id)}
                isSelected={image.id === selectedItem?.id}
                key={image.id}
                setSelectedItem={setSelectedItem}
                viewMode={viewMode}
            />
        ]
    )), [imagesCombinedState.items, disabledImages, selectedItem?.id, setSelectedItem, viewMode]);

    const renderedImageContainerDataFiltered = useMemo(() => renderedImageContainerData.filter((imageContainerData) => {
        return (
            !searchQuery || doesItemMatchSearchQuery(searchQuery, imageContainerData[0], ["title"])
            // ) && (
            //     !artistFilter || imageContainerData[0].Artists.map((a) => a.id).includes(parseInt(artistFilter.id))
            // ) && (
            //     !tagFilter || imageContainerData[0].Tags.map((t) => t.id).includes(parseInt(tagFilter.id))
        );
    }), [renderedImageContainerData, searchQuery]);

    const finalRenderedImageContainers = useMemo(() => renderedImageContainerDataFiltered.map((i) => i[1]), [renderedImageContainerDataFiltered]);

    return (
        <ManagementPageProvider
            Entity={Image}
            itemsCombinedState={imagesCombinedState}
            setItems={setImages}
        >
            <Box
                component={Paper}
                justifyItems="center"
                paddingLeft={1}
                square
                sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    gridTemplateRows: isDialogMode ? "80px 400px" : "80px calc(100vh - 144px)",
                    gridTemplateAreas: `
            "toolbar"
            "gallery"
            `
                }}
            >
                <Stack
                    direction="row"
                    justifyContent="space-around"
                    paddingBottom={2}
                    paddingTop={2}
                    spacing={2}
                    width="100%"
                >
                    <Stack
                        direction="row"
                        spacing={2}
                        sx={{ gridArea: "toolbar" }}
                    >
                        <SearchBox
                            placeholder="Search by image title"
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            width="300px"
                        />

                        {/* <ArtistFilterMenu
            artists={artists}
            filterValue={artistFilter}
            setFilterValue={setArtistFilter}
        />

        <TagFilterMenu
            filterValue={tagFilter}
            setFilterValue={setTagFilter}
            tags={tags}
        /> */}
                    </Stack>

                    <ToggleButtonGroup
                        exclusive
                        onChange={handleViewModeChange}
                        value={viewMode}
                    >
                        <ToggleButton
                            key="grid"
                            value="grid"
                        >
                            <GridOnIcon />
                        </ToggleButton>

                        <ToggleButton
                            key="list"
                            value="list"
                        >
                            <ViewListIcon />
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Stack>

                <Stack
                    direction="row"
                    flexWrap="wrap"
                    justifyContent="center"
                    spacing={1}
                    sx={{ gridArea: "gallery", overflowY: "scroll", justifyItems: "center", width: "100%" }}
                    useFlexGap
                    variant="standard"
                >
                    {finalRenderedImageContainers}
                </Stack>
            </Box>

        </ManagementPageProvider>
    );
};
CollectionGalleryDisplay.propTypes = {
    disabledImages: PropTypes.arrayOf(entityPropTypeShape),
    images: PropTypes.arrayOf(entityPropTypeShape),
    isDialogMode: PropTypes.bool.isRequired,
    selectedItem: PropTypes.shape({
        id: PropTypes.number
    }),
    setSelectedItem: PropTypes.func
};
