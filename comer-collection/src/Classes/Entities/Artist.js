import React from "react";
import { useTableRowItem } from "../../ContextProviders/TableRowProvider.js";
import { Entity } from "../Entity.js";
import { Button, Stack, Typography } from "@mui/material";
import { ContentCopyIcon, ImageIcon } from "../../Imports/Icons.js";

class Artist extends Entity {
    static baseUrl = "/api/admin/artists";
    static singular = "artist";
    static plural = "artists";

    static fieldDefinitions = [
        {
            fieldName: "familyName",
            displayName: "Last Name",
            isRequired: true
        },
        {
            fieldName: "givenName",
            displayName: "First Name",
            isRequired: true
        },
        {
            fieldName: "website",
            displayName: "Website",
            isRequired: false,
            inputType: "url"
        },
        {
            fieldName: "notes",
            displayName: "Notes",
            isRequired: false,
            inputType: "textarea",
            multiline: true,
            blank: ""
        }
    ];

    static searchBoxFields = ["fullName", "fullNameReverse", "notes"];

    static TableCells = {
        ID () {
            const artist = useTableRowItem();
            return (
                <Typography variant="body1">{artist.id}</Typography>
            );
        },
        Name () {
            const artist = useTableRowItem();
            return (
                <Typography variant="body1">{artist.familyName}, {artist.givenName}</Typography>
            );
        },
        ImageCount () {
            const artist = useTableRowItem();
            return (
                <Stack direction="row" spacing={1} alignItems="center">
                    <ImageIcon />
                    <Typography variant="body1">{artist.Images.length}</Typography>
                </Stack>
            );
        },
        Website () {
            const artist = useTableRowItem();
            return artist.website && (
                <Button size="small"
                    sx={{ textTransform: "unset" }}
                    endIcon={<ContentCopyIcon />} >
                    <Typography variant="body1">{artist.website}</Typography>
                </Button>
            );
        },
        Notes () {
            const artist = useTableRowItem();
            return (artist.notes &&
                <Typography variant="body1">{artist.notes}</Typography>
            ) || (!artist.notes &&
                <Typography variant="body1" sx={{ opacity: 0.5 }}></Typography>
            );
        },
        ManageEditButton () {
            return (
                <Entity.TableCells.EntityManageEditButton />
            );
        },
        ManageDeleteButton () {
            const artist = useTableRowItem();
            return (
                <Entity.TableCells.EntityManageDeleteButton
                    disabled={artist.Images.length > 0} />
            );
        },
        ManageOptionsArray () {
            return (
                <Stack direction="row">
                    <Artist.TableCells.ManageEditButton />
                    <Artist.TableCells.ManageDeleteButton />
                </Stack>
            );
        }
    };

    static tableFields = [
        {
            columnDescription: "ID",
            TableCellComponent: Artist.TableCells.ID,
            generateSortableValue: (artist) => artist.id
        },
        {
            columnDescription: "Name",
            maxWidth: "300px",
            TableCellComponent: Artist.TableCells.Name,
            generateSortableValue: (artist) => `${artist.familyName?.toLowerCase()}, ${artist.givenName?.toLowerCase()}`
        },
        {
            columnDescription: "Images",
            TableCellComponent: Artist.TableCells.ImageCount
        },
        {
            columnDescription: "Website",
            TableCellComponent: Artist.TableCells.Website
        },
        {
            columnDescription: "Notes",
            TableCellComponent: Artist.TableCells.Notes
        },
        {
            columnDescription: "Options",
            TableCellComponent: Artist.TableCells.ManageOptionsArray
        }
    ];
}

export { Artist };
