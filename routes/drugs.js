const express = require('express');
const router = express.Router();
const { Account } = require('../model/account');
const { Category } = require('../model/category');
const { Drugs } = require('../model/drugs');
const authGaurd = require('../util/authGaurd');
const mongoose = require('mongoose');
const InfuraHelper = require('../util/infura');

const {
  networks: {
    3: { address },
  },
  abi,
} = require('../build/contracts/Shelf.json');

//initialize the web3 connection
const infuraHelper = new InfuraHelper();
const web3 = infuraHelper.get_web3_instance();

//import constants
const { successMessage, errorMessage } = require('../util/constants');

router.post('/', authGaurd, async (req, res) => {
  const { content, categoryName } = req.body;
  try {
    let drug = await Category.findOne({ drugsName: content });
    if (drug) {
      return errorMessage.BAD_REQUEST(res, 'Drug already exist');
    }
    const cats = await Category.findOne({ categoryName });
    drug = new Drugs({
      _id: new mongoose.Types.ObjectId(),
      drugsName: content,
      categoryName: categoryName.toLowerCase(),
    });
    await drug.save();
    await Category.updateOne(
      { categoryName },
      { $set: { noOfDrugsInCategory: cats.noOfDrugsInCategory + 1 } }
    );
    const drugs = new web3.eth.Contract(abi, address);
    await drugs.methods
      .createDrugs(content, categoryName)
      .send({ from: req.userData.accountAddress });

    return successMessage.OK(res, 'Drug created Successfully');
  } catch (err) {
    console.log(err);
    return errorMessage.INTERNAL_SERVER_ERROR(res);
  }
});

router.get('/', async (req, res) => {
  try {
    const drug = await Drugs.find();
    const accounts = await web3.eth.getAccounts();
    const contract = new web3.eth.Contract(abi, address);
    const drugCount = await contract.methods.drugCount().call();
    const drugs = [];
    for (let i = 1; i <= drugCount; i++) {
      const cats = await contract.methods.drugs(i).call();
      drugs.push(cats);
    }
    return successMessage.OK(res, {
      accounts: accounts[0],
      drugCount,
      drugs,
      mongoDrugs: drug,
    });
  } catch (err) {
    console.log(err);
    return errorMessage.INTERNAL_SERVER_ERROR(res);
  }
});

module.exports = router;
