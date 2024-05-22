import { ExhibitionAccessCell } from "../../Components/TableCells/Exhibition/ExhibitionAccessCell.js";
import { ExhibitionDateCreatedStackedCell } from "../../Components/TableCells/Exhibition/ExhibitionDateCreatedStackedCell.js";
import { ExhibitionDateModifiedStackedCell } from "../../Components/TableCells/Exhibition/ExhibitionDateModifiedStackedCell.js";
import { ExhibitionIDCell } from "../../Components/TableCells/Exhibition/ExhibitionIDCell.js";
import { ExhibitionOptionsCell } from "../../Components/TableCells/Exhibition/ExhibitionOptionsCell.js";
import { ExhibitionOwnerStackedNameEmailCell } from "../../Components/TableCells/Exhibition/ExhibitionOwnerStackedNameEmailCell.js";
import { ExhibitionTitleCell } from "../../Components/TableCells/Exhibition/ExhibitionTitleCell.js";
import { Entity, entityPropTypeShape } from "../Entity.js";
import PropTypes from "prop-types";

class Exhibition extends Entity {
    static baseUrl = "/api/admin/exhibitions";
    static singular = "exhibition";
    static plural = "exhibitions";

    static handleMultiCreate () {
        return Promise.reject(new Error("MultiCreate is not allowed for exhibitions"));
    }

    static tableFields = [
        {
            columnDescription: "ID",
            TableCellComponent: ExhibitionIDCell,
            generateSortableValue: (exhibition) => exhibition.id
        },
        {
            columnDescription: "Title",
            maxWidth: "150px",
            TableCellComponent: ExhibitionTitleCell,
            generateSortableValue: (exhibition) => exhibition.title?.toLowerCase()
        },
        {
            columnDescription: "Owner",
            TableCellComponent: ExhibitionOwnerStackedNameEmailCell,
            generateSortableValue: (exhibition) => exhibition.User.full_name_reverse?.toLowerCase()
        },
        {
            columnDescription: "Created",
            TableCellComponent: ExhibitionDateCreatedStackedCell,
            generateSortableValue: (exhibition) => new Date(exhibition.date_created)
        },
        {
            columnDescription: "Modified",
            TableCellComponent: ExhibitionDateModifiedStackedCell,
            generateSortableValue: (exhibition) => new Date(exhibition.date_modified)
        },
        {
            columnDescription: "Access",
            TableCellComponent: ExhibitionAccessCell
        },
        {
            columnDescription: "Options",
            TableCellComponent: ExhibitionOptionsCell
        }
    ];
}

class MyExhition extends Exhibition {
    static baseUrl = "/api/user/exhibitions";
}

export const exhibitionStatePropTypesShape = {
    size: PropTypes.shape({
        length_ft: PropTypes.number,
        width_ft: PropTypes.number,
        height_ft: PropTypes.number
    }),
    appearance: PropTypes.shape({
        moodiness: PropTypes.string,
        main_wall_color: PropTypes.string,
        side_wall_color: PropTypes.string,
        floor_color: PropTypes.string,
        floor_texture: PropTypes.string,
        ceiling_color: PropTypes.string,
        ambient_light_color: PropTypes.string
    }),
    images: PropTypes.arrayOf(entityPropTypeShape)
};

export { Exhibition, MyExhition };
