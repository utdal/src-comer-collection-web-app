import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { sendAuthenticatedRequest } from "../../Helpers/APICalls.js";
import { DataTable } from "../../Components/DataTable.js";
import { PhotoCameraBackIcon } from "../../Imports/Icons.js";
import { useNavigate } from "react-router";
import { useTitle } from "../../ContextProviders/AppFeatures.js";

export const ExhibitionBrowser = () => {
    const [exhibitions, setExhibitions] = useState([]);

    const setTitleText = useTitle();

    const fetchPublicExhibitionData = async () => {
        try {
            const imageData = await sendAuthenticatedRequest("GET", "/api/public/exhibitions");
            setExhibitions(imageData.data);
        } catch (error) {
            console.error("Error fetching image metadata:", error);
        }
    };

    useEffect(() => {
        setTitleText("Public Exhibitions");
        fetchPublicExhibitionData();
    }, []);

    const navigate = useNavigate();

    const exhibitionTableFields = [
        {
            columnDescription: "Title",
            maxWidth: "200px",
            generateTableCell: (exhibition) => (
                <Typography variant="body1">{exhibition.title}</Typography>
            ),
            generateSortableValue: (exhibition) => exhibition.title?.toLowerCase()
        },
        {
            columnDescription: "Curator",
            generateTableCell: (exhibition) => (
                <Typography variant="body1">{exhibition.curator}</Typography>
            ),
            generateSortableValue: (exhibition) => exhibition.curator?.toLowerCase()
        },
        {
            columnDescription: "Last Updated",
            generateTableCell: (exhibition) => (
                <Typography variant="body1">{new Date(exhibition.date_modified).toLocaleString()}</Typography>
            ),
            generateSortableValue: (exhibition) => new Date(exhibition.date_modified)
        },
        {
            columnDescription: "Open",
            columnHeaderLabel: "",
            generateTableCell: (exhibition) => (
                <Button variant="outlined" onClick={() => {
                    navigate(`/Exhibitions/${exhibition.id}`);
                }}>
                    <Typography variant="body1">Open</Typography>
                </Button>
            )
        }
    ];

    return (
        <Box component={Paper} square justifyItems="center" sx={{
            height: "calc(100vh - 64px)",
            width: "100vw",
            boxSizing: "border-box"
        }} >
            <Stack spacing={4} sx={{
                paddingLeft: "200px",
                paddingRight: "200px",
                paddingTop: "50px"
            }}>
                <Stack direction="row" paddingLeft={1} spacing={2} justifyContent="space-between">
                    <Stack direction="row" paddingLeft={1} spacing={2} alignItems="center">
                        <PhotoCameraBackIcon fontSize="large" />
                        <Typography variant="h4">Public Exhibitions</Typography>
                    </Stack>
                </Stack>
                <Box sx={{ height: "calc(80vh - 64px)" }}>
                    <DataTable items={exhibitions} visibleItems={exhibitions} tableFields={exhibitionTableFields}
                        defaultSortAscending={false} defaultSortColumn="Last Updated"
                        nonEmptyHeight="500px" emptyMinHeight="500px" NoContentIcon={PhotoCameraBackIcon}
                        noContentButtonAction={() => {
                            navigate("/BrowseCollection");
                        }}
                        noContentButtonText="Browse Collection"
                    />
                </Box>
            </Stack>
        </Box>

    );
};
