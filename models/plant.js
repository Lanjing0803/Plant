const db = require('../database')

exports.all = async () => {
 const { rows } = await db.getPool().query("select * from plants order by id");
 return db.camelize(rows);
}


exports.add = async (plant) => {
  return await db.getPool()
    .query("INSERT INTO plants(name, description,plant_img_url) VALUES($1, $2,$3) RETURNING *",
      [plant.name, plant.description,plant.plantImgUrl]);
}

exports.get = async (id) => {
  const { rows } = await db.getPool().query("select * from plants where id = $1", [id]);
  return db.camelize(rows)[0];
}

exports.update = async (plant) => {
  return await db.getPool()
    .query("update plants set name = $1, description= $2, plant_img_url=$3 where id = $4 RETURNING *",
    [plant.name, plant.description,plant.plantImgUrl,plant.id]);
}

exports.upsert = async (plant) => {
  if (plant.id) {
    return exports.update(plant);
  } else {
    return exports.add(plant);
  }
}