import { Chip, Stack, Typography, ListItemButton } from "@mui/material";
import React, { useMemo } from "react";
import { SellIcon, PersonIcon } from "../../Imports/Icons.js";
import { ThumbnailBox } from "../../Components/CollectionBrowser/ThumbnailBox.js";
import { useLoaderData } from "react-router";
import { CollectionGalleryDisplay } from "../../Components/CollectionGalleryDisplay.js";

export const CollectionBrowserImageContainer = ({ image, viewMode, isSelected, setSelectedItem, isDisabled }) => {
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

export const CollectionBrowser = () => {
    const images = useLoaderData();

    return (
        <CollectionGalleryDisplay
            images={images}
            isDialogMode={false}
        />
    );
};
