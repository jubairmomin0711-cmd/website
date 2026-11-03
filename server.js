const express = require("express");
const bcrypt = require("bcryptjs");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(helmet());
app.use(express.json());
app.use(express.static("public"));

app.use("/api", rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30
}));

app.post("/api/register", async (req, res) => {
  try {
    const { name, mobile, email, service } = req.body;

    if (!name || !mobile || !email || !service) {
      return res.status(400).json({
        message: "Please fill all fields"
      });
    }

    const registration = {
      name,
      mobile,
      email,
      service,
      date: new Date().toLocaleString()
    };

    const file = path.join(__dirname, "customers.json");

    let customers = [];

    if (fs.existsSync(file)) {
      customers = JSON.parse(fs.readFileSync(file));
    }

    customers.push(registration);

    fs.writeFileSync(file, JSON.stringify(customers, null, 2));

    const message =
      `New Customer Registration\n` +
      `Name: ${name}\n` +
      `Mobile: ${mobile}\n` +
      `Email: ${email}\n` +
      `Service: ${service}`;

    const whatsappURL =
      "https://wa.me/919172020690?text=" +
      encodeURIComponent(message);

    res.json({
      message: "Registration successful",
      whatsappURL
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Website running on port ${PORT}`);
});