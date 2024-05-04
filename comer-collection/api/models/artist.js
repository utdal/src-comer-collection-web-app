import { DataTypes } from "sequelize";

/**
 * @param {import("sequelize").Sequelize} sequelize
 */
export default (sequelize) => {
    const Artist = sequelize.define("Artist", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            initialAutoIncrement: 1,
            primaryKey: true,
            field: "artist_id"
        },
        familyName: {
            type: DataTypes.TEXT("tiny"),
            allowNull: false,
            field: "artist_familyname"
        },
        givenName: {
            type: DataTypes.TEXT("tiny"),
            allowNull: false,
            field: "artist_givenname"
        },
        fullName: {
            type: DataTypes.VIRTUAL,
            get () {
                return `${this.givenName} ${this.familyName}`;
            }
        },
        fullNameReverse: {
            type: DataTypes.VIRTUAL,
            get () {
                return `${this.familyName}, ${this.givenName}`;
            }
        },
        website: {
            type: DataTypes.TEXT("tiny"),
            field: "artist_website",
            set (value) {
                this.setDataValue("website", value || null);
            }
        },
        notes: {
            type: DataTypes.TEXT("tiny"),
            field: "artist_notes",
            set (value) {
                this.setDataValue("notes", value || null);
            }
        },
        safe_display_name: {
            type: DataTypes.VIRTUAL,
            get () {
                return (this.familyName || this.givenName) ? `${this.fullName}` : `Artist ${this.id}`;
            }
        }
    }, {
        tableName: "comer_artists"
    });

    return Artist;
};
