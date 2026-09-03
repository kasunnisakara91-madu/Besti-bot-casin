const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>BESTIE MINI FREE CASE</title>
      <style>
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          min-height: 100vh;
          background: #080612;
          color: white;
          font-family: Arial, sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .box {
          width: 100%;
          max-width: 600px;
          padding: 35px 25px;
          text-align: center;
          border: 1px solid #8b5cf6;
          border-radius: 24px;
          background: #100b1f;
          box-shadow: 0 0 40px rgba(139,92,246,.25);
        }

        h1 {
          font-size: 30px;
          color: #c084fc;
          margin-bottom: 12px;
        }

        p {
          color: #b8b2c9;
          margin-bottom: 25px;
        }

        .status {
          display: inline-block;
          padding: 10px 18px;
          border-radius: 50px;
          background: #21143b;
          color: #d8b4fe;
          border: 1px solid #8b5cf6;
        }
      </style>
    </head>

    <body>
      <div class="box">
        <h1>BESTIE MINI FREE CASE</h1>
        <p>WhatsApp Bot Case Hub</p>
        <div class="status">● SERVER ONLINE</div>
      </div>
    </body>
    </html>
  `);
});

app.get("/health", (req, res) => {
  res.json({
    status: "online",
    message: "BESTIE MINI FREE CASE is running"
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
