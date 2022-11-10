const db = require("../models");
const config = require("../config/auth.config");
const { verification } = require("../middleware");
const { user: User, role: Role, refreshToken: RefreshToken } = db;

const Op = db.Sequelize.Op;

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

exports.getall = (req, res) => {

  try {

    // get the page and limit out of the api request

    const page = req.body.page ? parseInt (req.body.page): 1;
    const limit = req.body.limit ? parseInt (req.body.limit): 5;

    if ((page < 0) || (limit < 0)) {
        throw new Error ('page and limit can not have a negative values');
    }

    // get the startIndex values and get endIndex values 

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // making an empty object that holds the value of the current, prev and next pages

    const rep = {};

    // If the startIndex is greater than 0 then in that case
    // push previous page value and limit of data for each page

    if (startIndex > 0) {
        rep.previous = {
            details: {
                page: page - 1,
                limit
            }
        }
    }

    // push the current value in the rep object

    rep.current = {
        details: {
            page,
            limit
        }
    }


    // count the number of documents in the Articles collection of the database
    User.countUser ({
        author: req.founduser._id
    }).then ((countDocs) => {

        // if endindex < counted Objects then make the next property in rep Object
        if (endIndex < countDocs) {
            rep.next = {
                details: {
                    page: page + 1,
                    limit
                }
            }
        }

        // return a promise to find the Articles having author the 'logged in' user

        return Article.find ({
            author: req.founduser._id
        })
        .limit (limit) // applying limit to the results found
        .skip (startIndex) // skipping a certain number of docs from start equal to startIndex
    })
    .then ((foundDocs) => {

        // return Docs to the user
        return res.status (200).send ({
            status: 'success',
            foundDocs,
            rep
        })
    })
    .catch ((error) => {

        // return any error to the user
        return res.status (401).send ({
            status: 'failure',
            message: error.message
        })
    })

}
catch (error) {
    return res.status (401).send ({
        status: 'failure',
        message: error.message
    })
}
};

exports.getone = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.update = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.delete = (req, res) => {
  res.status(200).send("User Content.");
};



