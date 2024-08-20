import { Exhibition } from "../Entities/Exhibition";
import { Association } from "../Association";
import { Image } from "../Entities/Image";
import ExhibitionIDCell from "../../Components/TableCells/Exhibition/ExhibitionIDCell";
import ExhibitionTitleCell from "../../Components/TableCells/Exhibition/ExhibitionTitleCell";
import ExhibitionOpenInNewTabCell from "../../Components/TableCells/Exhibition/ExhibitionOpenInNewTabCell";
import ExhibitionDateCreatedStackedCell from "../../Components/TableCells/Exhibition/ExhibitionDateCreatedStackedCell";
import ExhibitionDateModifiedStackedCell from "../../Components/TableCells/Exhibition/ExhibitionDateModifiedStackedCell";
import ExhibitionAccessCell from "../../Components/TableCells/Exhibition/ExhibitionAccessCell";
import type { TableFieldDefinition } from "../../index.js";

class ImageExhibition extends Association {
    public static primary = Image;

    public static secondary = Exhibition;

    public static singular = "exhibition";

    public static plural = "exhibitions";

    public static tableFields: TableFieldDefinition[] = [
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
