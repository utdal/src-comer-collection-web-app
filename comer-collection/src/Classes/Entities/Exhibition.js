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
            TableCellComponent: Exhibition.TableCells.ID,
            generateSortableValue: (exhibition) => exhibition.id
        },
        {
            columnDescription: "Title",
            maxWidth: "150px",
            TableCellComponent: Exhibition.TableCells.Title,
            generateSortableValue: (exhibition) => exhibition.title?.toLowerCase()
        },
        {
            columnDescription: "Owner",
            TableCellComponent: Exhibition.TableCells.OwnerStackedNameEmail,
            generateSortableValue: (exhibition) => exhibition.User.full_name_reverse?.toLowerCase()
        },
        {
            columnDescription: "Created",
            TableCellComponent: Exhibition.TableCells.DateCreatedStacked,
            generateSortableValue: (exhibition) => new Date(exhibition.date_created)
        },
        {
            columnDescription: "Modified",
            TableCellComponent: Exhibition.TableCells.DateModifiedStacked,
            generateSortableValue: (exhibition) => new Date(exhibition.date_modified)
        },
        {
            columnDescription: "Access",
            TableCellComponent: Exhibition.TableCells.Access
        },
        {
            columnDescription: "Options",
            TableCellComponent: Exhibition.TableCells.ExhibitionOptions
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
