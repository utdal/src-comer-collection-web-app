import { Artist } from "../Entities/Artist.ts";
import { Image } from "../Entities/Image.js";
import { Association } from "../Association.ts";
import { ArtistIDCell } from "../../Components/TableCells/Artist/ArtistIDCell.js";
import { ArtistNameCell } from "../../Components/TableCells/Artist/ArtistNameCell.js";
import { ArtistNotesCell } from "../../Components/TableCells/Artist/ArtistNotesCell.js";

class ImageArtist extends Association {
    static url = "/api/imageartists";
    static primary = Image;
    static secondary = Artist;

    static singular = "credit";
    static plural = "credits";

    static assignPresent = "add to";
    static assignPast = "added to";
    static unassignPresent = "remove from";
    static unassignPast = "removed from";

    static secondaryFieldInPrimary = "Artists";

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
            columnDescription: "Artist",
            TableCellComponent: ArtistNameCell
        },
        {
            columnDescription: "Notes",
            TableCellComponent: ArtistNotesCell
        }
    ];
}

export { ImageArtist };
