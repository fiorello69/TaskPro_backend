import express from "express";
import {
  getAll,
  getById,
  addNew,
  updateById,
  deleteById,
  updateCurrentDashboard,
} from "../../controllers/dashboard.js";
import authenticate from "../../middlewares/authenticate.js";

const router = express.Router();

router.get("/", authenticate, getAll);

router.get("/:dashboardId", authenticate, getById);

router.post("/", authenticate, addNew);

router.put("/:dashboardId", authenticate, updateById);

router.patch("/:dashboardId", authenticate, updateCurrentDashboard);

router.delete("/:dashboardId", authenticate, deleteById);

export default router;
