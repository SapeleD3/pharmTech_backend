const express = require('express');
const router = express.Router();
const { Drugs } = require('../model/drugs');
const { Category } = require('../model/category')
const authGaurd = require('../util/authGaurd');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Web3 = require('web3');

const { networks: { 3 : { address } }, abi } = require('../build/contracts/Shelf.json')

//initialize the web3 connection
const mnemonic = process.env.MNEMONIC
const HDWalletProvider = require("@truffle/hdwallet-provider");
const web3 = new Web3(new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/b4f230692f4447d7ada5c87533509ce0"))

//import constants
const { successMessage, errorMessage } = require('../util/constants')


router.post('/', authGaurd, async (req, res) => {
    const { content } = req.body
    try {
        let cats = await Category.findOne({ categoryName: content })
        if(cats) {
            return errorMessage.BAD_REQUEST(res, "Category already exist")
        }
        cats = new Category({
            _id: new mongoose.Types.ObjectId(),
            categoryName: content,
            accountAddress: req.userData.accountAddress,
            noOfDrugsInCategory: 0
        })
        await cats.save()
        const category = new web3.eth.Contract(abi, address)
        await category.methods.createCategory(content).send({from: req.userData.accountAddress })
        
        return successMessage.OK(res, "Category created Successfully")
    } catch (err) {
        console.log(err)
        return errorMessage.INTERNAL_SERVER_ERROR(res);
    }
})

router.get('/', async (req, res) => {
    try {
        const cats = await Category.find()
        const accounts = await web3.eth.getAccounts()
        const category = new web3.eth.Contract(abi, address)
        const categoryCount = await category.methods.categoryCount().call()
        const categories = [];
        for (let i = 1; i <= categoryCount; i++) {
            const cats = await category.methods.categories(i).call()
            categories.push(cats)
          }
        return successMessage.OK(res, {
            accounts: accounts[0],
            categoryCount,
            categories,
            mongoCategories: cats
        })
    } catch (err) {
        console.log(err)
        return errorMessage.INTERNAL_SERVER_ERROR(res);
    }
})

router.get("/search", (req, res, next) => {
    const q = req.query.q;

    Category.find({
        categoryName : {
            $regex: new RegExp(q)
        }
    }, {
    _id: 0,
    __v: 0
    }, (err, data) => res.json(data)).limit(10)
})

router.get("/allDrugs/:categoryName", async (req, res) => {
    const categoryName = req.params.categoryName.toLowerCase()
    try {
        const drugs = await Drugs.find({ categoryName: categoryName})
        if(drugs.length >= 1){
            return successMessage.OK(res, drugs)
        } else {
            return errorMessage.BAD_REQUEST(res, "No drug was Found for this category")
        }
    } catch (err) {
        console.log(err)
        return errorMessage.INTERNAL_SERVER_ERROR(res)
    }
})

module.exports = router