const Pool = require("pg").Pool;

const db = (config) => {
  const pool = new Pool({
    user: config.dbuser,
    host: config.dbhost,
    database: config.dbname,
    password: config.dbpassword,
    port: config.dbport,
  });

  const updateMahasiswa = (request, response) => {
    const { nama, npm } = request.body;
    pool.query(
      "UPDATE mahasiswa SET nama = $1 WHERE npm = $2",
      [nama, npm],
      (error, results) => {
        if (error)
          return response
            .status(500)
            .send({ status: 500, message: "Internal Server Error" });
        if (results.rowCount !== 1) {
          pool.query(
            "INSERT INTO mahasiswa (nama, npm) VALUES($1, $2)",
            [nama, npm],
            (error, _) => {
              if (error)
                return response
                  .status(500)
                  .send({ status: 500, message: "Internal Server Error" });
            }
          );
          return;
        }
        return response.status(200).send({
          status: "OK",
        });
      }
    );
  };

  return {
    updateMahasiswa,
  };
};

module.exports = db;
