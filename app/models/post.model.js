import { DataTypes } from "sequelize";

export default  (sequelize) => {
    const Post = sequelize.define("post", {
        caption: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "",
        },
        tags: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "",
        },
        likes: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "",
        },
    }, {
        version: true,
        paranoid: true,
    });

    return Post
}