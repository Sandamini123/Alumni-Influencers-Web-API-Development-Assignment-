import app from "./app.js";
const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
  console.log(`Swagger: http://localhost:${port}/api-docs`);
});

console.log(process.env.DB_USER);