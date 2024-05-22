import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { sendAuthenticatedRequest } from "../../Helpers/APICalls.js";
import { DataTable } from "../../Components/DataTable/DataTable.js";
import { PhotoCameraBackIcon } from "../../Imports/Icons.js";
import { useNavigate } from "react-router";
import { useTitle } from "../../ContextProviders/AppFeatures.js";

export const ExhibitionBrowser = () => {
    const [exhibitions, setExhibitions] = useState([]);

    const navigate = useNavigate();

    const setTitleText = useTitle();

    const fetchPublicExhibitionData = useCallback(async () => {
        try {
            const imageData = await sendAuthenticatedRequest("GET", "/api/public/exhibitions");
            setExhibitions(imageData.data);
        } catch (error) {
            console.error("Error fetching image metadata:", error);
        }
    }, []);

    useEffect(() => {
        setTitleText("Public Exhibitions");
        fetchPublicExhibitionData();
    }, [setTitleText, fetchPublicExhibitionData]);

    const exhibitionTableFields = [
        {
            columnDescription: "Title",
            maxWidth: "200px",
            generateTableCell: (exhibition) => (
                <Typography variant="body1">
                    {exhibition.title}
                </Typography>
            ),
            generateSortableValue: (exhibition) => exhibition.title?.toLowerCase()
        },
        {
            columnDescription: "Curator",
            generateTableCell: (exhibition) => (
                <Typography variant="body1">
                    {exhibition.curator}
                </Typography>
            ),
            generateSortableValue: (exhibition) => exhibition.curator?.toLowerCase()
        },
        {
            columnDescription: "Last Updated",
            generateTableCell: (exhibition) => (
                <Typography variant="body1">
                    {new Date(exhibition.date_modified).toLocaleString()}
                </Typography>
            ),
            generateSortableValue: (exhibition) => new Date(exhibition.date_modified)
        },
        {
            columnDescription: "Open",
            columnHeaderLabel: "",
            generateTableCell: (exhibition) => (
                <Button
                    onClick={() => {
                        navigate(`/Exhibitions/${exhibition.id}`);
                    }}
                    variant="outlined"
                >
                    <Typography variant="body1">
                        Open
                    </Typography>
                </Button>
            )
        }
    ];

    return (
        <Box
            component={Paper}
            justifyItems="center"
            square
            sx={{
                height: "calc(100vh - 64px)",
                width: "100vw",
                boxSizing: "border-box"
            }}
        >
            <Stack
                spacing={4}
                sx={{
                    paddingLeft: "200px",
                    paddingRight: "200px",
                    paddingTop: "50px"
                }}
            >
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    paddingLeft={1}
                    spacing={2}
                >
                    <Stack
                        alignItems="center"
                        direction="row"
                        paddingLeft={1}
                        spacing={2}
                    >
                        <PhotoCameraBackIcon fontSize="large" />

                        <Typography variant="h4">
                            Public Exhibitions
                        </Typography>
                    </Stack>
                </Stack>

                <Box sx={{ height: "calc(80vh - 64px)" }}>
                    <DataTable
                        NoContentIcon={PhotoCameraBackIcon}
                        defaultSortAscending={false}
                        defaultSortColumn="Last Updated"
                        emptyMinHeight="500px"
                        items={exhibitions}
                        noContentButtonAction={() => {
                            navigate("/BrowseCollection");
                        }}
                        noContentButtonText="Browse Collection"
                        nonEmptyHeight="500px"
                        tableFields={exhibitionTableFields}
                        visibleItems={exhibitions}
                    />
                </Box>
            </Stack>
        </Box>

    );
};
