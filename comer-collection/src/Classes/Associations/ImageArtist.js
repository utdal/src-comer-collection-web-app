import { Artist } from "../Entities/Artist.js";
import { Image } from "../Entities/Image.js";
import { Association } from "../Association.js";

class ImageArtist extends Association {
    static url = "/api/admin/imageartists";
    static primary = Image;
    static secondary = Artist;

    static singular = "credit";
    static plural = "credits";

    static assignPresent = "add to";
    static assignPast = "added to";
    static unassignPresent = "remove from";
    static unassignPast = "removed from";

    static secondaryFieldInPrimary = "Artists";

    static tableFields = [
        {
            columnDescription: "ID",
            TableCellComponent: Artist.TableCells.ID,
            generateSortableValue: (artist) => artist.id
        },
        {
            columnDescription: "Artist",
            TableCellComponent: Artist.TableCells.Name
        },
        {
            columnDescription: "Notes",
            TableCellComponent: Artist.TableCells.Notes
        }
    ];
}

export { ImageArtist };
