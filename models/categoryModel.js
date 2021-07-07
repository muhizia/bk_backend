const sql = require("./db.js");

// constructor
const Category = function(category) {
    this.categoryName = category.categoryName;
};

Category.add = (newCategory, result) => {
    sql.query("INSERT INTO category SET ?", newCategory, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created category: ", { id: res.insertId, ...newCategory });
        result(null, { id: res.insertId, ...newCategory });
    });
};

Category.findById = (categoryId, result) => {
    sql.query(`SELECT * FROM category WHERE id = ${categoryId}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found category: ", res[0]);
            result(null, res[0]);
            return;
        }

        // not found Category with the id
        result({ kind: "not_found" }, null);
    });
};

Category.getAll = result => {
    sql.query("SELECT * FROM category", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("category: ", res);
        result(null, res);
    });
};

Category.updateById = (id, category, result) => {
    sql.query(
        "UPDATE category SET categoryName = ? WHERE id = ?", [category.categoryName, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                // not found Category with the id
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("updated category: ", { id: id, ...category });
            result(null, { id: id, ...category });
        }
    );
};

/** only admin access required */
Category.remove = (id, result) => {
    sql.query("DELETE FROM category WHERE id = ?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            // not found Category with the id
            result({ kind: "not_found" }, null);
            return;
        }

        console.log("deleted category with id: ", id);
        result(null, res);
    });
};

module.exports = Category;