import { Chip, Stack, Typography, ListItemButton } from "@mui/material";
import React, { useMemo } from "react";
import { SellIcon, PersonIcon } from "../../Imports/Icons";
import CollectionGalleryThumbnailBox from "./CollectionGalleryThumbnailBox";
import { useInView } from "react-intersection-observer";
import type { ArtistItem, ImageItem, TagItem } from "../../index.js";

const CollectionBrowserImageDetails = ({ image, viewMode, isSelected, setSelectedItem, isDisabled }: {
    readonly image: ImageItem;
    readonly viewMode: "grid" | "list";
    readonly isSelected: boolean;
    readonly setSelectedItem: React.Dispatch<React.SetStateAction<ImageItem | null>> | null;
    readonly isDisabled: boolean;
}): React.JSX.Element => {
    const { inView, ref } = useInView();

    const infoStack = useMemo(() => (
        <Stack
            direction={viewMode === "list" ? "row" : "column"}
            padding={4}
            ref={ref}
            spacing={2}
            sx={{
                width: viewMode === "list" ? "500px" : "200px"
            }}
        >
            <CollectionGalleryThumbnailBox image={image} />

            {inView
                ? (
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
                            {(image.Artists as ArtistItem[]).map((a) => (
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
                            {viewMode === "list" && (image.Tags as TagItem[]).map((t) => (
                                <Chip
                                    icon={<SellIcon />}
                                    key={t.id}
                                    label={(
                                        <Typography>
                                            {t.data}
                                        </Typography>
                                    )}
                                    sx={{ maxWidth: "150px" }}
                                    variant="filled"
                                />
                            ))}
                        </Stack>
                    </Stack>
                )
                : null}

        </Stack>
    ), [image, inView, ref, viewMode]);

    const listItemButton = useMemo(() => (
        <ListItemButton
            disableGutters
            disabled={isDisabled}
            onClick={(): void => {
                if (setSelectedItem) {
                    setSelectedItem(image);
                }
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

    return listItemButton;
};

export default CollectionBrowserImageDetails;
