import app from "./app";

const port = 5000;
app
  .listen({
    port: port,
  })
  .then(() => `Server is listening in port ${port}`);
