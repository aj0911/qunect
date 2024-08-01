//Importing Statements
const sequelize = require("./Config/database");
const server = require("./socket");

//importing .env files when app is not in production mode
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: ".env" });
}

//Handling uncaughtException
process.on("uncaughtException", (err) => {
  console.log(`message:${err.message}`);
  console.log(
    "Shutting down the server due to the Unhandled Promise Rejection"
  );
  process.exit(1);
});

// Synchronize models with database
sequelize.sync({ force: false })
  .then(() => console.log('Database & tables created!'))
  .catch(err => console.error('Error creating database tables:', err));

//Starting server on PORT = 5500 (default). You can change it from .env file.
server.listen(process.env.PORT, () => {
  console.log(`Server is working on http://localhost:${process.env.PORT}`);
});

//Handling Unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`message:${err.message}`);
  console.log(
    "Shutting down the server due to the Unhandled Promise Rejection"
  );
  server.close(() => {
    process.exit(1);
  });
});


