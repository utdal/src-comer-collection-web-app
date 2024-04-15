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
}

export { ImageArtist };
