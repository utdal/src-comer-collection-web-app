import { ArtistIDCell } from "../../Components/TableCells/Artist/ArtistIDCell.js";
import { ArtistImageCountCell } from "../../Components/TableCells/Artist/ArtistImageCountCell.js";
import { ArtistManageOptionsCell } from "../../Components/TableCells/Artist/ArtistManageOptionsCell.js";
import { ArtistNameCell } from "../../Components/TableCells/Artist/ArtistNameCell.js";
import { ArtistNotesCell } from "../../Components/TableCells/Artist/ArtistNotesCell.js";
import { ArtistWebsiteCell } from "../../Components/TableCells/Artist/ArtistWebsiteCell.js";
import { BrushIcon } from "../../Imports/Icons.js";
import { Entity } from "../Entity.js";

class Artist extends Entity {
    static baseUrl = "/api/artists";
    static singular = "artist";
    static plural = "artists";

    static fetcherUrl = "/Account/Admin/Artists";

    static entityManageRelativeUrl = "Artists";

    /**
     * @type {EntityFieldDefinition[]}
     */
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

    static DefaultIcon = BrushIcon;

    static searchBoxFields = ["fullName", "fullNameReverse", "notes"];
    static searchBoxPlaceholder = "Search artists by name or notes";

    /**
     * @type {TableFieldDefinition[]}
     */
    static tableFields = [
        {
            columnDescription: "ID",
            TableCellComponent: ArtistIDCell,
            generateSortableValue: (artist) => artist.id
        },
        {
            columnDescription: "Name",
            maxWidth: "300px",
            TableCellComponent: ArtistNameCell,
            generateSortableValue: (artist) => `${artist.familyName?.toLowerCase()}, ${artist.givenName?.toLowerCase()}`
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
    static baseUrl = "/api/artists";
}

export { Artist, PublicArtist };
