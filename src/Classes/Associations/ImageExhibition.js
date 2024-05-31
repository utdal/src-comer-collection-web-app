import { Exhibition } from "../Entities/Exhibition.ts";
import { Association } from "../Association.ts";
import { Image } from "../Entities/Image.js";
import { ExhibitionIDCell } from "../../Components/TableCells/Exhibition/ExhibitionIDCell.js";
import { ExhibitionTitleCell } from "../../Components/TableCells/Exhibition/ExhibitionTitleCell.js";
import { ExhibitionOpenInNewTabCell } from "../../Components/TableCells/Exhibition/ExhibitionOpenInNewTabCell.js";
import { ExhibitionDateCreatedStackedCell } from "../../Components/TableCells/Exhibition/ExhibitionDateCreatedStackedCell.js";
import { ExhibitionDateModifiedStackedCell } from "../../Components/TableCells/Exhibition/ExhibitionDateModifiedStackedCell.js";
import { ExhibitionAccessCell } from "../../Components/TableCells/Exhibition/ExhibitionAccessCell.js";

class ImageExhibition extends Association {
    static url = null;
    static primary = Image;
    static secondary = Exhibition;

    static singular = "exhibition";
    static plural = "exhibitions";

    /**
     * @type {TableFieldDefinition[]}
     */
    static tableFields = [
        {
            columnDescription: "ID",
            TableCellComponent: ExhibitionIDCell
        },
        {
            columnDescription: "Title",
            TableCellComponent: ExhibitionTitleCell
        },
        {
            columnDescription: "Open",
            TableCellComponent: ExhibitionOpenInNewTabCell
        },
        {
            columnDescription: "Created",
            TableCellComponent: ExhibitionDateCreatedStackedCell
        },
        {
            columnDescription: "Modified",
            TableCellComponent: ExhibitionDateModifiedStackedCell
        },
        {
            columnDescription: "Access",
            TableCellComponent: ExhibitionAccessCell
        }
    ];
}

export { ImageExhibition };
