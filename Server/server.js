const express = require("express");

const app = express();

app.get("/api/signup", (req, res) => {
  res.json({
    data: "you hit signup endpoint",
  });
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
