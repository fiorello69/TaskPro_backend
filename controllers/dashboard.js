import HttpError from "../helpers/HttpError.js";
import controllerWrapper from "../helpers/decorators.js";
import Dashboard from "../models/dashboard.js";
import Column from "../models/column.js";
import Card from "../models/card.js";

async function getAll(req, res) {
  const { _id: owner } = req.user;
  const result = await Dashboard.find({ owner }, "-createdAt -updatedAt");
  res.json(result);
}

async function getById(req, res) {
  const { dashboardId } = req.params;
  const dashboard = await Dashboard.findById(dashboardId);
  const columns = await Column.find({ owner: dashboard._id });

  if (columns.length > 0) {
    const columnsWithOwnCards = await Column.aggregate([
      {
        $match: { $or: columns },
      },
      {
        $lookup: {
          from: "cards",
          localField: "_id",
          foreignField: "owner",
          as: "cards",
        },
      },
    ]);
    if (!dashboard) throw HttpError(404);

    res.json({
      dashboard,
      columns: columnsWithOwnCards,
    });
  } else {
    res.json({
      dashboard,
      columns: [],
    });
  }
}

async function addNew(req, res) {
  const { _id: owner } = req.user;
  const result = await Dashboard.create({ ...req.body, owner });
  res.status(201).json(result);
}

async function deleteById(req, res) {
  const { dashboardId } = req.params;
  const deletedBoard = await Dashboard.findByIdAndDelete(dashboardId);
  const columns = await Column.find({ owner: dashboardId });
  const deletedColumn = await Column.deleteMany({ owner: dashboardId });
  const ArrayColumnsIds = columns.map((column) => column._id);
  const deletedCard = await Card.deleteMany({ owner: ArrayColumnsIds });
  if (!deletedBoard || !deletedColumn || !deletedCard || !columns) {
    throw HttpError(404);
  }
  res.json({
    deletedBoard,
    deletedColumn,
    deletedCard,
  });
}

async function updateById(req, res) {
  const { dashboardId } = req.params;
  const result = await Dashboard.findByIdAndUpdate(dashboardId, req.body, {
    new: true,
  });
  if (!result) throw HttpError(404);
  res.json(result);
}

async function updateCurrentDashboard(req, res) {
  const { dashboardId } = req.params;
  const result = await Dashboard.findByIdAndUpdate(
    dashboardId,
    { ...req.body },
    { new: true }
  );
  if (!result) throw HttpError(404);
  res.json(result);
}

const wrappedGetAll = controllerWrapper(getAll);
const wrappedGetById = controllerWrapper(getById);
const wrappedAddNew = controllerWrapper(addNew);
const wrappedDeleteById = controllerWrapper(deleteById);
const wrappedUpdateById = controllerWrapper(updateById);
const wrappedUpdateCurrentDashboard = controllerWrapper(updateCurrentDashboard);

export {
  wrappedGetAll as getAll,
  wrappedGetById as getById,
  wrappedAddNew as addNew,
  wrappedDeleteById as deleteById,
  wrappedUpdateById as updateById,
  wrappedUpdateCurrentDashboard as updateCurrentDashboard,
};
