import express from "express";
import authenticate from "../../middlewares/authenticate.js";
import {
  getById,
  updateById,
  addNew,
  removeById,
} from "../../controllers/column.js";

const router = express.Router();

router.get("/:columnId", authenticate, getById);

router.post("/:dashboardId", authenticate, addNew);

router.put("/:columnId", authenticate, updateById);

router.delete("/:columnId", authenticate, removeById);

export default router;
