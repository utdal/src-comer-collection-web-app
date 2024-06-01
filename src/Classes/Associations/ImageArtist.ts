import { Artist } from "../Entities/Artist";
import { Image } from "../Entities/Image";
import { Association } from "../Association";
import ArtistIDCell from "../../Components/TableCells/Artist/ArtistIDCell";
import ArtistNameCell from "../../Components/TableCells/Artist/ArtistNameCell";
import ArtistNotesCell from "../../Components/TableCells/Artist/ArtistNotesCell";
import type { Item, SortableValue, TableFieldDefinition } from "../..";

class ImageArtist extends Association {
    public static url = "/api/imageartists";

    public static primary = Image;

    public static secondary = Artist;

    public static singular = "credit";

    public static plural = "credits";

    public static assignPresent = "add to";

    public static assignPast = "added to";

    public static unassignPresent = "remove from";

    public static unassignPast = "removed from";

    public static secondaryFieldInPrimary = "Artists";

    public static tableFields: TableFieldDefinition[] = [
        {
            columnDescription: "ID",
            TableCellComponent: ArtistIDCell,
            generateSortableValue: (artist: Item): SortableValue => artist.id
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
