import { Box, Button, Paper, Stack, TableCell, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useTheme } from "@emotion/react";
import { sendAuthenticatedRequest } from "../Users/Tools/HelperMethods/APICalls";
import { DataTable } from "../Users/Tools/DataTable";
import OpenInNewIcon from "@mui/icons-material/OpenInNew"
import PhotoCameraBackIcon from "@mui/icons-material/PhotoCameraBack"

  
export const ExhibitionBrowser = () => {

    const [exhibitions, setExhibitions] = useState([]);

    const [sortColumn, setSortColumn] = useState("Last Updated");
    const [sortAscending, setSortAscending] = useState(false);
  
  

    const fetchPublicExhibitionData = async() => {
        try {
            const imageData = await sendAuthenticatedRequest("GET", '/api/exhibitions/public');
            setExhibitions(imageData.data);
      
          } catch (error) {
            console.error("Error fetching image metadata:", error);
          }
    }

    useEffect(() => {
        fetchPublicExhibitionData();
    }, [])

    const theme = useTheme();
  
    const exhibitionTableFields = [
        {
          columnDescription: "Title",
          generateTableCell: (exhibition) => (
            <TableCell sx={{wordWrap: "break-word", maxWidth: "200px"}}>
              <Typography variant="body1">{exhibition.title}</Typography>
            </TableCell>
          ),
          generateSortableValue: (exhibition) => exhibition.title?.toLowerCase()
        },
        {
          columnDescription: "Curator",
          generateTableCell: (exhibition) => (
            <TableCell>
              <Typography variant="body1">{exhibition.curator}</Typography>
            </TableCell>
          ),
          generateSortableValue: (exhibition) => exhibition.curator?.toLowerCase()
        },
        {
          columnDescription: "Last Updated",
          generateTableCell: (exhibition) => (
            <TableCell>
              <Typography variant="body1">{new Date (exhibition.date_modified).toDateString()}</Typography>
            </TableCell>
          ),
          generateSortableValue: (exhibition) => new Date (exhibition.date_modified)
        },
        {
          columnDescription: "Open",
          columnHeaderLabel: "",
          generateTableCell: (exhibition) => (
            <TableCell>
              <Button variant="outlined" endIcon={<OpenInNewIcon />} component="a" href={`/Exhibitions/${exhibition.id}`} target="_blank">
                <Typography variant="body1">Open</Typography>
              </Button>
            </TableCell>
          )
        },
      ]
    
      

    return (
        <Box component={Paper} square justifyItems="center" sx={{
            padding: "50px 300px"
            
            }} >
            <Stack spacing={4} padding={5}>
            <Stack direction="row" paddingLeft={1} spacing={2} justifyContent="space-between">
              <Stack direction="row" paddingLeft={1} spacing={2} alignItems="center">
                <PhotoCameraBackIcon fontSize="large" />
                <Typography variant="h4">Public Exhibitions</Typography>
              </Stack>
              </Stack>
                <DataTable visibleItems={exhibitions} tableFields={exhibitionTableFields} 
                    {...{sortColumn, setSortColumn, sortAscending, setSortAscending}}
                    nonEmptyHeight="500px" emptyMinHeight="500px"
                />
            </Stack>
                
        </Box>

    )
}
