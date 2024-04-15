import { DataTypes } from "sequelize";

export default (db) => {
    const { sequelize, Sequelize } = db;

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
            type: Sequelize.INTEGER,
            autoIncrement: true,
            initialAutoIncrement: 1,
            primaryKey: true,
            field: "exhibition_id"
        },
        title: {
            type: Sequelize.TEXT("tiny"),
            allowNull: false,
            field: "exhibition_title"
        },
        data: {
            type: Sequelize.BLOB("medium"),
            field: "exhibition_data",
            allowNull: true,
            get () {
                return this.getDataValue("data")?.toString("utf-8");
            }
        },
        date_created: {
            type: Sequelize.DATE(3),
            field: "exhibition_date_created",
            allowNull: false
        },
        date_modified: {
            type: Sequelize.DATE(3),
            field: "exhibition_date_modified",
            allowNull: false
        },
        privacy: {
            type: Sequelize.STRING(20),
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
