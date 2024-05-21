import { Exhibition } from "../Entities/Exhibition.js";
import { Association } from "../Association.js";
import { Image } from "../Entities/Image.js";

class ImageExhibition extends Association {
    static url = null;
    static primary = Image;
    static secondary = Exhibition;

    static singular = "exhibition";
    static plural = "exhibitions";

    static tableFields = [
        {
            columnDescription: "ID",
            TableCellComponent: Exhibition.TableCells.ID
        },
        {
            columnDescription: "Title",
            TableCellComponent: Exhibition.TableCells.Title
        },
        {
            columnDescription: "Open",
            TableCellComponent: Exhibition.TableCells.OpenInNewTab
        },
        {
            columnDescription: "Created",
            TableCellComponent: Exhibition.TableCells.DateCreatedStacked
        },
        {
            columnDescription: "Modified",
            TableCellComponent: Exhibition.TableCells.DateModifiedStacked
        },
        {
            columnDescription: "Access",
            TableCellComponent: Exhibition.TableCells.Access
        }
    ];
}

export { ImageExhibition };
