import { Sequelize } from "sequelize";

const sequelize = new Sequelize("db_chatapp", "root", "udanup123", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected");
  })
  .catch(() => {
    console.log("Database error");
  });

export = sequelize;
