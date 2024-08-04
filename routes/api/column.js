import express from "express";
import authenticate from "../../middlewares/authenticate.js";
import {
  getById,
  updateById,
  addNew,
  deleteById,
} from "../../controllers/column.js";

const router = express.Router();

router.get("/:columnId", authenticate, getById);

router.post("/:dashboardId", authenticate, addNew);

router.put("/:columnId", authenticate, updateById);

router.delete("/:columnId", authenticate, deleteById);

export default router;
