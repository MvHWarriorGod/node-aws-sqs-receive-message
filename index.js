const express = require("express");
const { receiveMessage } = require("./receivesqs");

const app = express();

app.get("/", (req, res) => {
  res.send("Bienvenido a Prueba de Cola");
});

// Iniciar el sondeo de SQS
receiveMessage();

const port = 3000;

app.listen(port, () => {
  console.log("Servidor corriendo en el puerto 3000");
});
