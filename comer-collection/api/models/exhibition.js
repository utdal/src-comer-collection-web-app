import { DataTypes } from "sequelize";

/**
 * @param {import("sequelize").Sequelize} sequelize
 */
export default (sequelize) => {
    /**
     * @description The subquery that returns curator names based on exhibition privacy settings
     * @type {[import("sequelize").Utils.Literal, string]}
     */
    const publicCuratorSubquery = [
        sequelize.literal(`(
            SELECT if(exhibition.exhibition_privacy = 'PUBLIC',
                concat(user_given_name, ' ', user_family_name), ''
            )
            FROM comer_users AS user
            WHERE
                user.user_id = exhibition.exhibition_owner
        )`), "curator"
    ];

    const Exhibition = sequelize.define("Exhibition", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            initialAutoIncrement: 1,
            primaryKey: true,
            field: "exhibition_id"
        },
        title: {
            type: DataTypes.TEXT("tiny"),
            allowNull: false,
            field: "exhibition_title"
        },
        data: {
            type: DataTypes.BLOB("medium"),
            field: "exhibition_data",
            allowNull: true,
            get () {
                return this.getDataValue("data")?.toString("utf-8");
            }
        },
        date_created: {
            type: DataTypes.DATE(3),
            field: "exhibition_date_created",
            allowNull: false
        },
        date_modified: {
            type: DataTypes.DATE(3),
            field: "exhibition_date_modified",
            allowNull: false
        },
        privacy: {
            type: DataTypes.STRING(20),
            field: "exhibition_privacy",
            allowNull: false,
            validate: {
                isIn: [["PUBLIC", "PUBLIC_ANONYMOUS", "PRIVATE"]]
            },
            defaultValue: "PRIVATE"
        },
        safe_display_name: {
            type: DataTypes.VIRTUAL,
            get () {
                return this.title;
            }
        }
    }, {
        defaultScope: {
            attributes: {
                exclude: ["data"]
            }
        },
        scopes: {
            with_data: {
            },
            with_public_curators: {
                attributes: {
                    include: [publicCuratorSubquery]
                }
            }
        },
        sequelize,
        tableName: "comer_exhibitions"
    });

    return Exhibition;
};
