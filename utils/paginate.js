const defaultLimit = 12;

const paginate = async ({ cursor, limit = defaultLimit, page = 0, mongooseModel }) => {
  page = parseInt(page) || 0;
  limit = parseInt(limit) || defaultLimit;

  const data = {};
  const [count] = await mongooseModel.aggregate(cursor._pipeline).count('total');
  data.total = count ? count.total : 0;

  if (limit !== -1) cursor = cursor.skip(page == 0 ? 0 : page * limit).limit(limit);
  data.array = await cursor;

  if (data.array.length == limit) data.nextPage = page + 1;
  return data;
};

module.exports = paginate;
