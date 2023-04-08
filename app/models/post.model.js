import { DataTypes } from "sequelize";

export default  (sequelize) => {
    const Post = sequelize.define("post", {
        caption: {
            type: DataTypes.STRING,
        },
        tags: {
            type: DataTypes.STRING,
        },
        likes: {
            type: DataTypes.INTEGER,
        },
        image: {
            type: DataTypes.STRING,
        },
    });

    return Post
}