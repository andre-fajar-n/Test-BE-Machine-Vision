import dbConfig from "../config/db.config.js";
import { Sequelize } from "sequelize";

// import model
import userModel from "./user.model.js";
import postModel from "./post.model.js";
import userLikedModel from "./userLiked.model.js";

// connect to db
export const sequelize = new Sequelize(dbConfig.NAME, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle,
    },
    define: {
        freezeTableName: true,
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// assign model to db
db.user = userModel(sequelize);
db.post = postModel(sequelize);
db.userLiked = userLikedModel(sequelize);

// define relation between user and post
db.user.hasMany(db.post, {as: "posts"});
db.post.belongsTo(db.user, {
    foreignKey: "userId",
    as: "user"
})

// define many-to-many between user and post
db.user.belongsToMany(db.post, { through: db.userLiked });
db.post.belongsToMany(db.user, { through: db.userLiked });

export default db;