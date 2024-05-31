import { DataTypes } from "sequelize";

/**
 * @param {import("sequelize").Sequelize} sequelize
 */
export default (sequelize) => {
    const Course = sequelize.define("Course", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            initialAutoIncrement: 1,
            primaryKey: true,
            field: "course_id"
        },
        name: {
            type: DataTypes.TEXT("tiny"),
            allowNull: false,
            field: "course_name"
        },
        date_start: {
            type: DataTypes.DATE,
            field: "course_date_start",
            allowNull: false
        },
        date_end: {
            type: DataTypes.DATE,
            field: "course_date_end",
            allowNull: false
        },
        status: {
            type: DataTypes.VIRTUAL,
            get () {
                const now = Date.now();
                if (this.date_end < now) { return "Expired"; } else if (this.date_start > now) { return "Upcoming"; } else if (this.date_start <= now && this.date_end >= now) { return "Active"; }
                return "Invalid status";
            }
        },
        notes: {
            type: DataTypes.TEXT("tiny"),
            field: "course_notes",
            set (value) {
                this.setDataValue("course_notes", value || null);
            }
        },
        safe_display_name: {
            type: DataTypes.VIRTUAL,
            get () {
                return this.name ? this.name : `Course ${this.id}`;
            }
        }
    }, {
        tableName: "comer_courses",
        validate: {
            dateRange () {
                if (this.date_start > this.date_end) { throw new Error("Course end time must be after course start time"); }
            }
        }
    });

    return Course;
};
