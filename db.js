const Pool = require("pg").Pool;

const db = (config) => {
  const pool = new Pool({
    user: config.dbuser,
    host: config.dbhost,
    database: config.dbname,
    password: config.dbpassword,
    port: config.dbport,
  });

  const updateUser = (request, response) => {
    const { nama, npm } = request.body;
    pool.query(
      "UPDATE mahasiswa SET nama = $1 WHERE npm = $2",
      [nama, npm],
      (error, results) => {
        if (error) throw error;
        if (results.rowCount !== 1) {
          pool.query(
            "INSERT INTO mahasiswa (nama, npm) VALUES($1, $2)",
            [nama, npm],
            (error, _) => {
              if (error) throw error;
            }
          );
        }
        response.status(200).send({
          status: "OK",
        });
      }
    );
    pool.query("SELECT * FROM mahasiswa", (_, results) => {});
  };

  return {
    updateUser,
  };
};

module.exports = db;
