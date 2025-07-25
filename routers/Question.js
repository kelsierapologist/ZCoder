const express = require('express');
const router = express.Router();
const QuestionDB = require('../models/Question');
const mongoose = require('mongoose');

router.post('/', async (req, res) => {
    const questionData = new QuestionDB({
        title: req.body.title,
        body: req.body.body,
        tags: req.body.tag,
        user: req.body.user
    })

    await questionData.save().then((doc) => {
        res.status(201).send({
            status: true,
            data: doc,
        })
    }).catch((err) => {
        res.status(400).send({
            status: false,
            message: "Error adding question",
        })
    })
})

router.get('/', async (req, res) => {
    QuestionDB.aggregate([
        {
            $lookup: {
                from: "comments",
                let: { question_id: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$question_id", "$$question_id"],
                            },
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                            comment: 1,
                            created_at: 1,
                        },
                    },
                ],
                as: "comments",
            },
        },
        {
            $lookup: {
                from: "answers",
                let: { question_id: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$question_id", "$$question_id"],
                            },
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                        },
                    },
                ],
                as: "answerDetails",
            },
        },
        {
            $project: {
                __v: 0,
            },
        },
    ])
        .exec()
        .then((questionDetails) => {
            res.status(200).send(questionDetails);
        }).catch((e) => {
            console.log(e);
            res.status(400).send(e);
        })
})


router.get('/:id', async (req, res) => {
    try {
        QuestionDB.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(req.params.id) },
            },
            {
                $lookup: {
                    from: "answers",
                    let: { question_id: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$question_id", "$$question_id"],
                                },
                            },
                        },
                        {
                            $project: {
                                _id: 1,
                                user: 1,
                                answer: 1,
                                question_id: 1,
                                created_at: 1,
                            },
                        },
                    ],
                    as: "answerDetails",
                },
            },
            {
                $lookup: {
                    from: "comments",
                    let: { question_id: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$question_id", "$$question_id"],
                                },
                            },
                        },
                        {
                            $project: {
                                _id: 1,
                                question_id: 1,
                                user: 1,
                                comment: 1,
                                created_at: 1,
                            },
                        },
                    ],
                    as: "comments",
                },
            },
            {
                $project: {
                    __v: 0,
                },
            },
        ])
            .exec()
            .then((questionDetails) => {
                res.status(200).send(questionDetails);
            }).catch((e) => {
                console.log(e);
                res.status(400).send(e);
            })
    }
    catch (error) {
        console.log(error);
        res.status(400).send({
            message: "Question not found",
        });
    }
})

module.exports = router;