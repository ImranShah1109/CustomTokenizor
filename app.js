const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));

// View engine

app.set("view engine", "ejs");

// Routes
app.get("/", (req, res) => {
  return res.render("index", {
    encodedToken: null,
    input: null,
    decodedFromToken: null,
    decodedInput: null,
    error1: null,
    error2: null,
  });
});

app.post("/encode", (req, res) => {
  const input = req.body.user_input;

  if (!input || input.trim() === "") {
    return res.render("index", {
      encodedToken: null,
      input: null,
      decodedFromToken: null,
      decodedInput: null,
      error1: "Please enter anything",
      error2: null,
    });
  }

  const words = input.trim().split(/\s+/);

  const encodeToken = words.map((word) => {
    const asciiArray = word.split("").map((char) => char.charCodeAt(0));
    return Buffer.from(asciiArray).toString("hex");
  });

  return res.render("index", {
    encodedToken: encodeToken,
    input,
    decodedFromToken: null,
    decodedInput: null,
    error1: null,
    error2: null,
  });
});

app.post("/decode", (req, res) => {
  let decodedInput = req.body.token_input;

  if (!decodedInput || decodedInput.trim() === "") {
    return res.render("index", {
      encodedToken: null,
      input: null,
      decodedFromToken: null,
      decodedInput: null,
      error1: null,
      error2: "Please enter encoded text",
    });
  }

  decodedInput = decodedInput
    .replace(/[\[\],]/g, " ") // remove brackets and commas
    .trim()
    .replace(/\s+/g, " "); // collapse multiple spaces

  const tokens = decodedInput.split(" ");

  const words = tokens.map((hex) => {
    try {
      return Buffer.from(hex, "hex").toString("utf-8");
    } catch (error) {
      return "";
    }
  });
  const decodedFromToken = words.join(" ");

  res.render("index", {
    encodedToken: null,
    input: null,
    decodedFromToken,
    decodedInput: req.body.token_input, // keep original input in form
    error1: null,
    error2: null,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
