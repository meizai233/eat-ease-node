const { MongoClient } = require("mongodb");
const config = require("./config.js");

const _connectDB = async () => {
  try {
    const client = new MongoClient(config.url);
    const database = client.db(config.dbName);
    return database;
  } catch (err) {
    throw new Error(err);
  }
};

// 查找
exports.find = async (collectionName, filter = {}, json = {}) => {
  const database = await _connectDB();
  const collection = database.collection(collectionName);
  const { limit = 0, skip = 0, sort = {} } = json;
  const datalist = collection.find(filter).limit(limit).skip(skip).sort(sort);
  try {
    const docs = await datalist.toArray();
    return docs;
  } catch (err) {
    throw new Error(err);
  }
};

exports.getCount = async (collectionName, filter) => {
  const database = await _connectDB();
  const collection = database.collection(collectionName);
  try {
    const count = collection.countDocuments(filter);
    return count;
  } catch (err) {
    throw new Error(err);
  }
};

exports.updateMany = () => [];

exports.insertMany = async (collectionName, arr) => {
  const database = await _connectDB();
  const collection = database.collection(collectionName);
  try {
    const result = collection.insertMany(arr);
    return result;
  } catch (err) {
    throw new Error(err);
  }
};

exports.deleteMany = async (collectionName, filter) => {
  const db = await _connectDB();
  const collection = db.collection(collectionName);
  try {
    const result = collection.deleteMany(filter);
    return result;
  } catch (err) {
    throw new Error(err);
  }
};
