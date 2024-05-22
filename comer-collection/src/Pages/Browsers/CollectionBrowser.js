import { Box, Chip, Paper, Stack, ToggleButton, ToggleButtonGroup, Typography, ListItemButton } from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { sendAuthenticatedRequest } from "../../Helpers/APICalls.js";
import { ArtistFilterMenu } from "../../Components/Menus/ArtistFilterMenu.js";
import { SellIcon, PersonIcon, GridOnIcon, ViewListIcon } from "../../Imports/Icons.js";
import { TagFilterMenu } from "../../Components/Menus/TagFilterMenu.js";
import SearchBox from "../../Components/SearchBox.js";
import { doesItemMatchSearchQuery } from "../../Helpers/SearchUtilities.js";
import PropTypes from "prop-types";
import { ThumbnailBox } from "../../Components/CollectionBrowser/ThumbnailBox.js";

const CollectionBrowserImageContainer = ({ image, viewMode, isSelected, setSelectedItem, isDisabled }) => {
    const infoStack = useMemo(() => (
        <Stack
            direction={viewMode === "list" ? "row" : "column"}
            padding={4}
            spacing={2}
            sx={{
                width: viewMode === "list" ? "500px" : "200px"
            }}
        >
            <ThumbnailBox image={image} />

            <Stack
                alignItems={viewMode === "list" ? "left" : "center"}
                direction="column"
                spacing={1}
            >
                <Typography variant="h6">
                    {image.title}
                </Typography>

                {viewMode === "list" && (
                    <Typography variant="body1">
                        {image.year}
                    </Typography>
                )}

                <Stack
                    direction={viewMode === "list" ? "column" : "row"}
                    spacing={viewMode === "list" ? 0 : 2}
                >
                    {image.Artists.map((a) => (
                        <Stack
                            alignItems="center"
                            direction="row"
                            key={a.id}
                            spacing={1}
                        >
                            <PersonIcon />

                            <Typography variant="body1">
                                {a.fullName}
                            </Typography>
                        </Stack>
                    ))}
                </Stack>

                <Stack
                    direction="row"
                    flexWrap="wrap"
                    spacing={1}
                    useFlexGap
                >
                    {viewMode === "list" && image.Tags.map((t) => (
                        <Chip
                            icon={<SellIcon />}
                            key={t.id}
                            label={
                                <Typography>
                                    {t.data}
                                </Typography>
                            }
                            sx={{ maxWidth: "150px" }}
                            variant="filled"
                        />
                    ))}
                </Stack>
            </Stack>
        </Stack>
    ), [image, viewMode]);

    const listItemButton = useMemo(() => (
        <ListItemButton
            disableGutters
            disabled={isDisabled}
            onClick={() => {
                setSelectedItem(image);
            }}
            selected={isSelected}
            sx={{
                borderRadius: "10px",
                justifyContent: "center"
            }}
        >
            {infoStack}
        </ListItemButton>
    ), [image, isSelected, isDisabled, infoStack, setSelectedItem]);

    return setSelectedItem ? listItemButton : infoStack;
};

const disabledImagesDefaultValue = [];

export const CollectionBrowser = ({ isDialogMode, selectedItem = null, setSelectedItem = null, disabledImages = disabledImagesDefaultValue }) => {
    const [images, setImages] = useState([]);
    const [artists, setArtists] = useState([]);
    const [tags, setTags] = useState([]);

    const [viewMode, setViewMode] = useState("grid");

    const handleViewModeChange = (event, next) => {
        setViewMode(next);
    };

    const [artistFilter, setArtistFilter] = useState(null);
    const [tagFilter, setTagFilter] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchImageData = useCallback(async () => {
        try {
            const imageData = await sendAuthenticatedRequest("GET", "/api/public/images");
            setImages(imageData.data);
        } catch (error) {
            console.error("Error fetching image metadata:", error);
        }
    }, []);

    const fetchArtistData = useCallback(async () => {
        try {
            const artistData = await sendAuthenticatedRequest("GET", "/api/public/artists");
            setArtists(artistData.data);
        } catch (error) {
            console.error("Error fetching artists:", error);
        }
    }, []);

    const fetchTagData = useCallback(async () => {
        try {
            const tagData = await sendAuthenticatedRequest("GET", "/api/public/tags");
            setTags(tagData.data);
        } catch (error) {
            console.error("Error fetching tags:", error);
        }
    }, []);

    useEffect(() => {
        fetchImageData();
        fetchArtistData();
        fetchTagData();
    }, [isDialogMode, fetchArtistData, fetchImageData, fetchTagData]);

    const renderedImageContainerData = useMemo(() => images.map((image) => (
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
    )), [images, selectedItem, disabledImages, viewMode, setSelectedItem]);

    const renderedImageContainerDataFiltered = useMemo(() => renderedImageContainerData.filter((imageContainerData) => {
        return (
            !searchQuery || doesItemMatchSearchQuery(searchQuery, imageContainerData[0], ["title"])
        ) && (
            !artistFilter || imageContainerData[0].Artists.map((a) => a.id).includes(parseInt(artistFilter.id))
        ) && (
            !tagFilter || imageContainerData[0].Tags.map((t) => t.id).includes(parseInt(tagFilter.id))
        );
    }), [renderedImageContainerData, artistFilter, tagFilter, searchQuery]);

    const finalRenderedImageContainers = useMemo(() => renderedImageContainerDataFiltered.map((i) => i[1]), [renderedImageContainerDataFiltered]);

    return (
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

                    <ArtistFilterMenu
                        artists={artists}
                        filterValue={artistFilter}
                        setFilterValue={setArtistFilter}
                    />

                    <TagFilterMenu
                        filterValue={tagFilter}
                        setFilterValue={setTagFilter}
                        tags={tags}
                    />
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
    );
};

CollectionBrowser.propTypes = {
    disabledImages: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number
    })).isRequired,
    isDialogMode: PropTypes.bool.isRequired,
    selectedItem: PropTypes.shape({
        id: PropTypes.number
    }).isRequired,
    setSelectedItem: PropTypes.func.isRequired
};
