import app from "./app";

const port = 5000;
app
  .listen({
    port: port,
  })
  .then(() => console.log(`Server is listening in port ${port}`));
