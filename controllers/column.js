import HttpError from "../helpers/HttpError.js";
import controllerWrapper from "../helpers/decorators.js";
import Column from "../models/column.js";
import Card from "../models/card.js";

async function getById(req, res) {
  const { columnId } = req.params;
  const column = await Column.findById(columnId);
  if (!column) throw HttpError(404);
  const cards = await Card.find({ owner: column._id });
  if (!cards) throw HttpError(404);
  res.json({
    column,
    cards,
  });
}
async function addNew(req, res) {
  const { dashboardId } = req.params;
  const result = await Column.create({
    ...req.body,
    owner: dashboardId,
  });
  res.status(201).json(result);
}

async function removeById(req, res) {
  const { columnId } = req.params;
  const result = await Column.findByIdAndDelete(columnId);
  if (!result) throw HttpError(404);
  res.json(result);
}

async function updateById(req, res) {
  const { columnId } = req.params;
  const result = await Column.findByIdAndUpdate(columnId, req.body, {
    new: true,
  });
  if (!result) throw HttpError(404);
  res.json(result);
}

const wrappedGetById = controllerWrapper(getById);
const wrappedAddNew = controllerWrapper(addNew);
const wrappedRemoveById = controllerWrapper(removeById);
const wrappedUpdateById = controllerWrapper(updateById);

export {
  wrappedGetById as getById,
  wrappedAddNew as addNew,
  wrappedRemoveById as removeById,
  wrappedUpdateById as updateById,
};
