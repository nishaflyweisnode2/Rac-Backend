const aboutus = require('../models/aboutusModel')

exports.addaboutus = async (req, res) => {
    try {
        const aboutusData = await aboutus.create({ aboutus: req.body.aboutus });
        res.status(200).json({ message: "  aboutus Added ", details: aboutusData })
    }
    catch (err) {
        console.log(err);
        res.status(400).send({ message: err.message })
    }
}

exports.updateaboutus = async (req, res) => {
    try {
        const Updatedaboutus = await aboutus.findOneAndUpdate({ _id: req.params.id }, { aboutus: req.body.aboutus })//.exec();
        console.log(Updatedaboutus);
        return res.status(200).json({ message: "aboutus Update", data: Updatedaboutus })
    } catch (err) {
        console.log(err)
        return res.status(401).json({
            mesage: err.mesage
        })
    }
}

exports.Deleteaboutus = async (req, res) => {
    try {
        const id = req.params.id;
        await aboutus.deleteOne({ _id: id });
        res.status(200).send({ message: "aboutus deleted " })
    } catch (err) {
        console.log(err);
        res.status(400).send({ message: err.message })
    }
}

exports.getAllaboutus = async (req, res) => {
    try {
        const data = await aboutus.find();
        console.log(data);
        return res.status(200).json({
            aboutus: data
        })

    } catch (err) {
        res.status(400).send({ mesage: err.mesage });
    }
}

exports.getaboutusById = async (req, res) => {
    try {
        const data = await aboutus.find({ _id: req.params.id })
        console.log(data);
        return res.status(200).json({
            aboutus: data
        })

    } catch (err) {
        res.status(400).send({ mesage: err.mesage });
    }
}