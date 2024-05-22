import React from "react";
import { Card, CardContent, Divider, Paper, Stack, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { exhibitionStatePropTypesShape } from "../../Classes/Entities/Exhibition.js";
import { entityPropTypeShape } from "../../Classes/Entity.js";

export const ArtInfoPopup = ({ globalImageCatalog, imageId, exhibitionState }) => {
    const infoFromCatalog = globalImageCatalog.find((i) => i.id === imageId);
    const infoFromExhibition = exhibitionState.images.find((i) => i.imageId === imageId);
    return (
        <Card
            component={Paper}
            raised
            sx={{
                position: "absolute",
                top: 10,
                left: 10,
                width: "calc(30vw - 90px)",
                opacity: 0.8,
                visibility: imageId ? "" : "hidden"
            }}
        >
            <CardContent>
                <Stack spacing={2}>
                    <Typography variant="h5">
                        {infoFromCatalog?.title}
                    </Typography>

                    {infoFromCatalog?.Artists.length > 0 && (
                        <Stack>
                            {infoFromCatalog?.Artists.map((a) => (
                                <Typography key={a.id}>
                                    {a.safe_display_name}
                                </Typography>
                            ))}
                        </Stack>
                    )}

                    {(infoFromCatalog?.year)
                        ? (
                            <>
                                <Divider />

                                <Typography>
                                    {infoFromCatalog?.year}
                                </Typography>
                            </>
                        )
                        : null}

                    {(infoFromExhibition?.metadata.description)
                        ? (
                            <>
                                <Divider />

                                <Typography>
                                    {infoFromExhibition?.metadata.description}
                                </Typography>
                            </>
                        )
                        : null}

                    {(infoFromExhibition?.metadata.additional_information)
                        ? (
                            <>
                                <Divider />

                                <Typography>
                                    {infoFromExhibition?.metadata.additional_information}
                                </Typography>
                            </>
                        )
                        : null}
                </Stack>
            </CardContent>
        </Card>
    );
};
ArtInfoPopup.propTypes = {
    exhibitionState: PropTypes.shape(exhibitionStatePropTypesShape).isRequired,
    globalImageCatalog: PropTypes.arrayOf(entityPropTypeShape).isRequired,
    imageId: PropTypes.number.isRequired
};
