import { NotFoundError } from '../errors/not-found-error';
import { Handler } from 'express';
import { Document, Model } from 'mongoose';
import { ApiFeatures } from './api-features';

// T is document, K is ModAttrs
interface IMod<T extends Document> extends Model<T> {
  build(modAttrs: any): T;
}

// Where T is Model Type, and K is Document Type
export function getAll<T extends Document>(Mod: IMod<T>): Handler {
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

export function getOne<T extends Document>(Mod: IMod<T>): Handler {
  return async (req, res) => {
    const { id } = req.params;

    const query = Mod.findById(id);
    const doc = await query;
    if (!doc) {
      throw new NotFoundError('Document with this id is not found');
    }

    res.send(doc);
  };
}

// T is document, K is ModAttrs
export function createOne<T extends Document>(Mod: IMod<T>): Handler {
  return async (req, res) => {
    const newDoc = Mod.build(req.body);
    await newDoc.save();

    res.status(201).send(newDoc);
  };
}

export function updateOne<T extends Document>(Mod: IMod<T>): Handler {
  return async (req, res) => {
    const doc = await Mod.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      throw new NotFoundError('Document with this id is not found');
    }

    res.send(doc);
  };
}

export function deleteOne<T extends Document>(Mod: IMod<T>): Handler {
  return async (req, res) => {
    const { id } = req.params;
    const doc = await Model.findByIdAndDelete(id);

    if (!doc) {
      throw new NotFoundError('Document with this id is not found');
    }

    res.status(204).send(null);
  };
}
