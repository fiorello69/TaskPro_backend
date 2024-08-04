import HttpError from "../helpers/HttpError.js";
import controllerWrapper from "../helpers/decorators.js";
import Card from "../models/card.js";


async function getById(req, res) {
  const { cardId } = req.params;
  const result = await Card.findById(cardId);
  if (!result) throw HttpError(404);
  res.json(result);
}

async function addNew(req, res) {
  const { columnId } = req.params;
  const result = await Card.create({
    ...req.body,
    owner: columnId,
  });
  res.status(201).json(result);
}

async function deleteById(req, res) {
  const { cardId } = req.params;
  const result = await Card.findByIdAndDelete(cardId);
  if (!result) throw HttpError(404);
  res.json(result);
}

async function updateById(req, res) {
  const { cardId } = req.params;
  const result = await Card.findByIdAndUpdate(cardId, req.body, {
    new: true,
  });
  if (!result) throw HttpError(404);
  res.json(result);
}

async function setNewCardOwner(req, res) {
  const { cardId, columnId } = req.params;
  const result = await Card.findByIdAndUpdate(
    cardId,
    { owner: columnId },
    {
      new: true,
    }
  );
  if (!result) throw HttpError(404);
  res.json(result);
}

const wrappedGetById = controllerWrapper(getById);
const wrappedAddNew = controllerWrapper(addNew);
const wrappedDeleteById = controllerWrapper(deleteById);
const wrappedUpdateById = controllerWrapper(updateById);
const wrappedSetNewCardOwner = controllerWrapper(setNewCardOwner);

export {
  wrappedGetById as getById,
  wrappedAddNew as addNew,
  wrappedDeleteById as deleteById,
  wrappedUpdateById as updateById,
  wrappedSetNewCardOwner as setNewCardOwner,
};
