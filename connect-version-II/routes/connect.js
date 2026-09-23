const express = require("express");
const mongoose = require("mongoose");
const { verifyJWT } = require("../auth-guard");

const router = express.Router();

const Thought = mongoose.model(
    "Thought",
    new mongoose.Schema({}, {
        collection: "thoughts",
        strict: false
    })
);

const NewsData = mongoose.model(
    "NewsData",
    new mongoose.Schema({}, {
        collection: "newsdata",
        strict: false
    })
);

const models = {


    thoughts: Thought,

    newsdata: NewsData

};

router.get("/:collection", verifyJWT, async (req, res) => {

    try {

        const collection = req.params.collection;

        const model = models[collection];

        if (!model) {

            return res.status(404).json({
                success: false,
                message: "Invalid request call"
            });

        }

        const data = await model.find();

        return res.status(200).json({
            success: true,
            collection,
            count: data.length,
            data
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

});

module.exports = router;
