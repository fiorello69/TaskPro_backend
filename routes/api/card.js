import express from "express";

import {
  getById,
  updateById,
  addNew,
  removeById,
  setNewCardOwner,
} from "../../controllers/card.js";
import authenticate from "../../middlewares/authenticate.js";

const router = express.Router();

router.get("/:cardId", authenticate, getById);

router.post("/:columnId", authenticate, addNew);

router.put("/:cardId", authenticate, updateById);

router.delete("/:cardId", authenticate, removeById);

router.patch("/:cardId/owner/:columnId", authenticate, setNewCardOwner);

export default router;
