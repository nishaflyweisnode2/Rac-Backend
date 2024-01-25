const timeslot = require('../models/timeslotModel')

exports.addtimeslot = async (req, res) => {
    try {
        const timeslotData = await timeslot.create({ timeslot: req.body.timeslot });
        res.status(200).json({ message: "  timeslot Added ", details: timeslotData })
    }
    catch (err) {
        console.log(err);
        res.status(400).send({ message: err.message })
    }
}

exports.updatetimeslot = async (req, res) => {
    try {
        const Updatedtimeslot = await timeslot.findOneAndUpdate({ _id: req.params.id }, { timeslot: req.body.timeslot })//.exec();
        console.log(Updatedtimeslot);
        return res.status(200).json({ message: "timeslot Update", data: Updatedtimeslot })
    } catch (err) {
        console.log(err)
        return res.status(401).json({
            mesage: err.mesage
        })
    }
}

exports.Deletetimeslot = async (req, res) => {
    try {
        const id = req.params.id;
        await timeslot.deleteOne({ _id: id });
        res.status(200).send({ message: "timeslot deleted " })
    } catch (err) {
        console.log(err);
        res.status(400).send({ message: err.message })
    }
}

exports.getAlltimeslot = async (req, res) => {
    try {
        const data = await timeslot.find();
        console.log(data);
        return res.status(200).json({
            timeslot: data
        })

    } catch (err) {
        res.status(400).send({ mesage: err.mesage });
    }
}

exports.gettimeslotById = async (req, res) => {
    try {
        const data = await timeslot.find({ _id: req.params.id })
        console.log(data);
        return res.status(200).json({
            timeslot: data
        })

    } catch (err) {
        res.status(400).send({ mesage: err.mesage });
    }
}