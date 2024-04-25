const db = require('../database')

exports.statuses = [
  "Healthy","Flowering","Dead"
]

exports.add = async (plantUser) => {
  return db.getPool()
    .query(`INSERT INTO
            users_plants(plant_id, user_id, status)
            VALUES($1, $2, $3) RETURNING *`,
      [plantUser.plantId, plantUser.userId, plantUser.status]);
}

exports.update = async (plantUser) => {
  return await db.getPool()
    .query("UPDATE users_plants SET status = $1,name=$2 where id = $3 RETURNING *",
      [plantUser.status,plantUser.name, plantUser.id]);
}

exports.upsert = (plantUser) => {
  if (plantUser.id) {
    return exports.update(plantUser);
  } else {
    return exports.add(plantUser);
  }
}

exports.get = async (plant, user) => {
  const { rows } = await db.getPool().query(`
    select *
    from users_plants
    where plant_id = $1 and user_id = $2`,
    [plant.id, user.id])
  return db.camelize(rows)[0]
}

exports.AllForUser = async (user) => {
  const { rows } = await db.getPool().query(`
    select plants.name, users_plants.*
    from users_plants
    join plants on plants.id = users_plants.plant_id
    where user_id = $1;`,
    [user.id]);
  return db.camelize(rows);
}