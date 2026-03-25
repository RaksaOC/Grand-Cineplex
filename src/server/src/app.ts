import express from "express";
import cors from "cors";
import customerRoute from "./app/customer/routes/index";
import cashierRoute from "./app/cashier/routes/index";
import managerRoute from "./app/manager/routes/index";

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5174", ""], // Adjust this to your frontend URL
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true, // Allow cookies to be sent with requests
  })
);

app.options("*", cors());
// Middleware
app.use(express.json());

app.get("/health", async (req, res) => {
  return res.json(200).json({ "status": "ok" });
})

app.use("/customer", customerRoute);
app.use("/cashier", cashierRoute);
app.use("/manager", managerRoute);

export default app;
