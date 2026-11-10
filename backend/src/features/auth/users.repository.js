import { ObjectId } from 'mongodb';

import { getDb } from '../../db/connection.js';
import { COLLECTIONS } from '../../db/collections.js';

export const usersIndexes = {
  [COLLECTIONS.users]: [
    { key: { email: 1 }, unique: true },
    {
      key: { googleId: 1 },
      unique: true,
      partialFilterExpression: { googleId: { $type: 'string' } },
    },
  ],
};

const collection = () => getDb().collection(COLLECTIONS.users);

export const normalizeEmail = (email) => email.trim().toLowerCase();

// The only shape of a user that ever leaves the backend.
export function toPublicUser(user) {
  return { id: String(user._id), email: user.email, displayName: user.displayName };
}

export function findByEmail(email) {
  return collection().findOne({ email: normalizeEmail(email) });
}

export function findById(id) {
  if (!ObjectId.isValid(id)) return null;
  return collection().findOne({ _id: new ObjectId(id) });
}

export function findByGoogleId(googleId) {
  return collection().findOne({ googleId });
}

export async function createUser(fields) {
  const now = new Date();
  const doc = {
    email: normalizeEmail(fields.email),
    displayName: fields.displayName.trim(),
    passwordHash: fields.passwordHash ?? null,
    googleId: fields.googleId ?? null,
    emailVerified: Boolean(fields.emailVerified),
    verification: fields.verification ?? null,
    createdAt: now,
    updatedAt: now,
  };
  const { insertedId } = await collection().insertOne(doc);
  return { ...doc, _id: insertedId };
}

export function updateUser(id, set) {
  return collection().findOneAndUpdate(
    { _id: id },
    { $set: { ...set, updatedAt: new Date() } },
    { returnDocument: 'after' },
  );
}

export function incrementVerificationAttempts(id) {
  return collection().updateOne({ _id: id }, { $inc: { 'verification.attempts': 1 } });
}
