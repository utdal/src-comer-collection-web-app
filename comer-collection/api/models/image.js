module.exports = (db) => {
    const { sequelize, Sequelize } = db;
    const Image = sequelize.define("Image", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            initialAutoIncrement: 1,
            primaryKey: true,
            field: "image_id"
        },
        accessionNumber: {
            type: Sequelize.TEXT("tiny"),
            field: "image_acc_no",
            set(value) {
                this.setDataValue("image_acc_no", value ? value : null);
            }
        },
        title: {
            type: Sequelize.TEXT("tiny"),
            allowNull: false,
            field: "image_title"
        },
        year: {
            type: Sequelize.INTEGER,
            field: "image_year",
            set(value) {
                this.setDataValue("year", value ? value : null);
            }
        },
        additionalPrintYear: {
            type: Sequelize.INTEGER,
            field: "image_addl_print_year",
            set(value) {
                this.setDataValue("additionalPrintYear", value ? value : null);
            }
        },
        medium: {
            type: Sequelize.TEXT("tiny"),
            field: "image_medium",
            set(value) {
                this.setDataValue("image_medium", value ? value : null);
            }
        },
        width: {
            type: Sequelize.DECIMAL(7, 4),
            allowNull: false,
            field: "image_width"
        },
        height: {
            type: Sequelize.DECIMAL(7, 4),
            allowNull: false,
            field: "image_height"
        },
        matWidth: {
            type: Sequelize.DECIMAL(7, 4),
            field: "image_mat_width",
            set(value) {
                this.setDataValue("matWidth", value ? value : null);
            }
        },
        matHeight: {
            type: Sequelize.DECIMAL(7, 4),
            field: "image_mat_height",
            set(value) {
                this.setDataValue("matHeight", value ? value : null);
            }
        },
        edition: {
            type: Sequelize.TEXT("tiny"),
            field: "image_edition",
            set(value) {
                this.setDataValue("image_edition", value ? value : null);
            }
        },
        condition: {
            type: Sequelize.TEXT("tiny"),
            field: "image_condition",
            set(value) {
                this.setDataValue("image_condition", value ? value : null);
            }
        },
        valuationNotes: {
            type: Sequelize.TEXT("tiny"),
            field: "image_valuation",
            set(value) {
                this.setDataValue("image_valuation", value ? value : null);
            }
        },
        otherNotes: {
            type: Sequelize.TEXT("medium"),
            field: "image_notes_other",
            set(value) {
                this.setDataValue("image_notes_other", value ? value : null);
            }
        },
        copyright: {
            type: Sequelize.TEXT("tiny"),
            field: "image_copyright",
            set(value) {
                this.setDataValue("image_copyright", value ? value : null);
            }
        },
        subject: {
            type: Sequelize.TEXT("tiny"),
            field: "image_subject",
            set(value) {
                this.setDataValue("image_subject", value ? value : null);
            }
        },
        url: {
            type: Sequelize.TEXT("tiny"),
            field: "image_url",
            set(value) {
                this.setDataValue("image_url", value ? value : null);
            }
        },
        thumbnailUrl: {
            type: Sequelize.TEXT("tiny"),
            field: "image_thumbnail_url",
            set(value) {
                this.setDataValue("image_thumbnail_url", value ? value : null);
            }
        },
        location: {
            type: Sequelize.TEXT("tiny"),
            field: "image_location",
            set(value) {
                this.setDataValue("image_location", value ? value : null);
            }
        }
    }, {
        tableName: "comer_images",
        defaultScope: {
            attributes: {
                exclude: ["url", "thumbnailUrl"]
            }
        },
        scopes: {
            admin: {
                attributes: {
                    include: ["url", "thumbnailUrl"]
                }
            }
        }
    });

    return Image;
};