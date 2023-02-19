import app from "./app";

const port = 5000;
console.log("oi");
app
  .listen({
    port: port,
  })
  .then(() => `Server is listening in port ${port}`);
