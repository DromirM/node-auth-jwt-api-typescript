import app from "./app";

const PORT = process.env.PORT;

app.listen(PORT, (err) => {
  if (err) {
    console.error("Se ha producido un error: ", err?.message);
  }
  console.log(`Server is running on PORT: ${PORT}`);
});
