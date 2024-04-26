const db = require('../database');

exports.all = async () => {
  const { rows } = await db.getPool().query("SELECT * FROM waterings ORDER BY id");
  return db.camelize(rows);
}

exports.getByUserId = async (userId) => {
  const { rows } = await db.getPool().query(`
      SELECT w.*, p.name AS plantName
      FROM waterings w
      JOIN users_plants up ON w.user_plant_id = up.id
      JOIN plants p ON up.plant_id = p.id
      WHERE up.user_id = $1
      ORDER BY w.user_plant_id
  `, [userId]);
  return db.camelize(rows);
}

exports.getPlantsByUserId = async (userId) => {
  const query = `
    SELECT up.id AS user_plant_id, p.id AS plant_id, p.name AS plant_name
    FROM plants p
    INNER JOIN users_plants up ON p.id = up.plant_id
    WHERE up.user_id = $1
  `;
  const { rows } = await db.getPool().query(query, [userId]);
  return rows;
};

exports.add = async (watering) => {
  return await db.getPool()
    .query("INSERT INTO waterings(watering_date, user_plant_id) VALUES($1, $2) RETURNING *",
      [watering.wateringDate, watering.userPlantId]);
}

exports.get = async (id) => {
  const { rows } = await db.getPool().query("SELECT * FROM waterings WHERE id = $1", [id]);
  return db.camelize(rows)[0];
}

exports.update = async (watering) => {
  return await db.getPool()
    .query("UPDATE waterings SET watering_date = $1, user_plant_id = $2 WHERE id = $3 RETURNING *",
    [watering.wateringDate, watering.userPlantId, watering.id]);
}

exports.upsert = async (watering) => {
  if (watering.id) {
    return exports.update(watering);
  } else {
    return exports.add(watering);
  }
}
