import { Exhibition } from "../Entities/Exhibition.js";
import { Association } from "../Association.js";
import { Image } from "../Entities/Image.js";

class ImageExhibition extends Association {
    static url = null;
    static primary = Image;
    static secondary = Exhibition;

    static singular = "exhibition";
    static plural = "exhibitions";

}

export { ImageExhibition };