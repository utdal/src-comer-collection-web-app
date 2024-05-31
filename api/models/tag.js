import { DataTypes } from "sequelize";

/**
 * @param {import("sequelize").Sequelize} sequelize
 */
export default (sequelize) => {
    const Tag = sequelize.define("Tag", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            initialAutoIncrement: 1,
            primaryKey: true,
            field: "tag_id"
        },
        data: {
            type: DataTypes.TEXT("tiny"),
            allowNull: false,
            field: "tag_data"
        },
        notes: {
            type: DataTypes.TEXT("tiny"),
            field: "tag_notes"
        },
        safe_display_name: {
            type: DataTypes.VIRTUAL,
            get () {
                return (this.data !== "" ? this.data : `Tag ${this.id}`);
            }
        }
    }, {
        tableName: "comer_image_tags"
    });

    return Tag;
};
