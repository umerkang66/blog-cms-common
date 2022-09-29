import { NotFoundError } from '../errors/not-found-error';
import { Handler } from 'express';
import { Document, Model } from 'mongoose';
import { ApiFeatures } from './api-features';

// T is document, K is ModAttrs
interface IMod extends Model<Document> {
  build(modAttrs: any): Document;
}

// Where T is Model Type, and K is Document Type
export function getAll(Mod: IMod): Handler {
  return async (req, res) => {
    const query = Mod.find();
    const requestQuery = req.query;

    // On the req.query, if there are some filter params present filter it, if fields are present limit it, if sort sort is present sort it, or if paginate is present paginate it.
    const features = new ApiFeatures(query, requestQuery)
      .filter()
      .limitFields()
      .sort()
      .paginate();

    const documents = await features.getQuery();
    res.send(documents);
  };
}

export function getOne(Mod: IMod): Handler {
  return async (req, res) => {
    const { id } = req.params;
    const query = Mod.findById(id);
    // TODO: we have to add populate options
    const document = await query;

    if (!document) {
      throw new NotFoundError('Document with this id is not found');
    }
    res.send(document);
  };
}

// T is document, K is ModAttrs
export function createOne(Mod: IMod): Handler {
  return async (req, res) => {
    const newDocument = Mod.build(req.body);
    await newDocument.save();

    res.status(201).send(newDocument);
  };
}

export function updateOne(Mod: IMod): Handler {
  return async (req, res) => {
    // you should have run the validators (express-validators), before passing
    // the req.body to
    const { id } = req.params;
    const { body } = req;
    const updatedDocument = await Mod.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedDocument) {
      throw new NotFoundError('Document with this id is not found');
    }
    res.send(updatedDocument);
  };
}

export function deleteOne(Mod: IMod): Handler {
  return async (req, res) => {
    const { id } = req.params;
    const deletedDocument = await Mod.findByIdAndDelete(id);

    if (!deletedDocument) {
      throw new NotFoundError('Document with this id is not found');
    }
    res.status(204).send(null);
  };
}
