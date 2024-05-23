import { Exhibition } from "../Entities/Exhibition.js";
import { User } from "../Entities/User.js";
import { Association } from "../Association.js";
import { ExhibitionIDCell } from "../../Components/TableCells/Exhibition/ExhibitionIDCell.js";
import { ExhibitionTitleCell } from "../../Components/TableCells/Exhibition/ExhibitionTitleCell.js";
import { ExhibitionOpenInNewTabCell } from "../../Components/TableCells/Exhibition/ExhibitionOpenInNewTabCell.js";
import { ExhibitionDateCreatedStackedCell } from "../../Components/TableCells/Exhibition/ExhibitionDateCreatedStackedCell.js";
import { ExhibitionDateModifiedStackedCell } from "../../Components/TableCells/Exhibition/ExhibitionDateModifiedStackedCell.js";
import { ExhibitionAccessCell } from "../../Components/TableCells/Exhibition/ExhibitionAccessCell.js";

class UserExhibition extends Association {
    static url = null;
    static primary = User;
    static secondary = Exhibition;

    static singular = "exhibition";
    static plural = "exhibitions";

    static secondaryFieldInPrimary = "Exhibitions";

    static secondarySearchBoxFields = ["title"];
    static secondarySearchBoxPlaceholder = "Search exhibitions by title";

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

export { UserExhibition };
