import type React from "react";
import { ArtistIDCell } from "../../Components/TableCells/Artist/ArtistIDCell.js";
import { ArtistImageCountCell } from "../../Components/TableCells/Artist/ArtistImageCountCell.js";
import { ArtistManageOptionsCell } from "../../Components/TableCells/Artist/ArtistManageOptionsCell.js";
import { ArtistNameCell } from "../../Components/TableCells/Artist/ArtistNameCell.js";
import { ArtistNotesCell } from "../../Components/TableCells/Artist/ArtistNotesCell.js";
import { ArtistWebsiteCell } from "../../Components/TableCells/Artist/ArtistWebsiteCell.js";
import { BrushIcon } from "../../Imports/Icons.js";
import { Entity } from "../Entity";
import type { EntityFieldDefinition, Item, SortableValue } from "../../index.js";

class Artist extends Entity {
    public static baseUrl = "/api/artists";

    public static singular = "artist";

    public static plural = "artists";

    public static fetcherUrl = "/Account/Admin/Artists";

    public static entityManageRelativeUrl = "Artists";

    public static fieldDefinitions: EntityFieldDefinition[] = [
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

    public static DefaultIcon = BrushIcon as React.FunctionComponent;

    public static searchBoxFields = ["fullName", "fullNameReverse", "notes"];

    public static searchBoxPlaceholder = "Search artists by name or notes";

    /**
     * @type {TableFieldDefinition[]}
     */
    public static tableFields = [
        {
            columnDescription: "ID",
            TableCellComponent: ArtistIDCell,
            generateSortableValue: (artist: Item): SortableValue => artist.id
        },
        {
            columnDescription: "Name",
            maxWidth: "300px",
            TableCellComponent: ArtistNameCell,
            generateSortableValue: (artist: Item): SortableValue => `${(artist.familyName as string).toLowerCase()}, ${(artist.givenName as string).toLowerCase()}`
        },
        {
            columnDescription: "Images",
            TableCellComponent: ArtistImageCountCell
        },
        {
            columnDescription: "Website",
            TableCellComponent: ArtistWebsiteCell
        },
        {
            columnDescription: "Notes",
            TableCellComponent: ArtistNotesCell
        },
        {
            columnDescription: "Options",
            TableCellComponent: ArtistManageOptionsCell
        }
    ];
}

class PublicArtist extends Artist {
    public static baseUrl = "/api/artists";
}

export { Artist, PublicArtist };
