import { Box, Paper, Stack, ToggleButton, ToggleButtonGroup } from "@mui/material";
import React, { useCallback, useMemo, useState } from "react";
import { GridOnIcon, ViewListIcon } from "../../Imports/Icons";
import SearchBox from "../SearchBox";
import CollectionBrowserImageDetails from "./CollectionGalleryImageDetails.js";
import { useItems, useItemsPagination, useVisibilityStatuses } from "../../ContextProviders/ManagementPageProvider";
import PaginationSummary from "../PaginationSummary/PaginationSummary.js";
import type { ImageItem } from "../../index.js";
import type { ExhibitionImageData } from "../ExhibitionPage/ExhibitionDispatchActionTypes.js";

const disabledImagesDefaultValue: ImageItem[] = [];

type CollectionGalleryGridViewMode = "grid" | "list";

const CollectionGalleryGrid = ({ isDialogMode, selectedItem = null, setSelectedItem = null, disabledImages = disabledImagesDefaultValue }: {
    readonly isDialogMode: boolean;
    readonly selectedItem?: ImageItem | null;
    readonly setSelectedItem?: React.Dispatch<React.SetStateAction<ImageItem | null>> | null;
    readonly disabledImages?: ExhibitionImageData[] | ImageItem[];
}): React.JSX.Element => {
    const [viewMode, setViewMode] = useState("grid" as CollectionGalleryGridViewMode);

    const [itemsArray] = useItems();
    const imagesArray = itemsArray as ImageItem[];
    const [visibilityStatuses] = useVisibilityStatuses();
    const { paginationStatus } = useItemsPagination();

    const handleViewModeChange = useCallback((event: React.MouseEvent<HTMLElement>, value: CollectionGalleryGridViewMode): void => {
        setViewMode(value);
    }, []);

    const [searchQuery, setSearchQuery] = useState("");

    const filteredImagesArray = useMemo(() => {
        return imagesArray.filter((image) => visibilityStatuses[image.id]);
    }, [imagesArray, visibilityStatuses]);

    const finalImagesArray = useMemo(() => {
        if (paginationStatus.enabled) {
            return filteredImagesArray.slice(paginationStatus.startIndex, paginationStatus.endIndex + 1);
        } else {
            return filteredImagesArray;
        }
    }, [filteredImagesArray, paginationStatus.enabled, paginationStatus.endIndex, paginationStatus.startIndex]);

    const renderedImageDetailContainers = useMemo(() => {
        return finalImagesArray.map((image) => (
            <CollectionBrowserImageDetails
                image={image}
                isDisabled={disabledImages.map((di) => di.image_id).includes(image.id)}
                isSelected={image.id === selectedItem?.id}
                key={image.id}
                setSelectedItem={setSelectedItem}
                viewMode={viewMode}
            />
        ));
    }, [disabledImages, finalImagesArray, selectedItem?.id, setSelectedItem, viewMode]);

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
                    <PaginationSummary />
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
            >
                {renderedImageDetailContainers}
            </Stack>
        </Box>
    );
};

export default CollectionGalleryGrid;
