const express = require('express');
const router = express.Router();
const { Account } = require('../model/account');
const authGaurd = require('../util/authGaurd');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Web3 = require('web3');

//initialize the web3 connection
const mnemonic = process.env.MNEMONIC
const HDWalletProvider = require("@truffle/hdwallet-provider");
const web3 = new Web3(new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/b4f230692f4447d7ada5c87533509ce0"))

//import constants
const { successMessage, errorMessage } = require('../util/constants')

router.post('/create', async (req, res) => {
    const {email, password, confirmPassword} = req.body
    try {
        //create an account
        const eth_account = await web3.eth.accounts.create()
        const privateKey = eth_account.privateKey
        const accountAddress = eth_account.address
        //hash privatekey to store in db
        const privateKeyHash = await web3.eth.accounts.encrypt(privateKey, password)
        if(password !== confirmPassword) {
            return errorMessage.BAD_REQUEST(res, 'Passwords must Match')
        }
        let account = await Account.findOne({email})
        if(account) {
            return errorMessage.BAD_REQUEST(res, "email already registered to an Eth account")
        }
        account = new Account({
            _id: new mongoose.Types.ObjectId(),
            email,
            password: privateKeyHash,
            accountAddress
        })
        const accountDetails = await account.save()
        const token = jwt.sign(
            {
                _id: accountDetails._id,
                accountAddress: accountDetails.accountAddress,
            },
            process.env.JWT_KEY,
            {
                expiresIn: '2h'
            }
        )
        return successMessage.OK(res, token)

    } catch (err) {
        console.log('error', err)
        return errorMessage.INTERNAL_SERVER_ERROR(res)
    }
})

router.post('/login', async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await Account.findOne({email})
        if(user) {
            const hashedCode = await web3.eth.accounts.decrypt(user.password, password)
            if(hashedCode) {
                const token = jwt.sign(
                    {
                        _id: user._id,
                        accountAddress: user.accountAddress,
                    },
                    process.env.JWT_KEY,
                    {
                        expiresIn: '2h'
                    }
                )
                return successMessage.OK(res, token)
            }
        } else {
            return errorMessage.BAD_REQUEST(res, "Invalid email please try again")
        }
    } catch (err) {
        console.log(err)
        return errorMessage.INTERNAL_SERVER_ERROR(res)
    }
})

router.get('/userDetail', authGaurd, async (req, res) => {
    const _id = req.userData._id
    try {
        const user = await Account.findOne({_id}).select("-password -__v");
        const balance = await web3.eth.getBalance(user.accountAddress)
        const data = {
            user,
            balance: web3.utils.fromWei(balance, 'ether')
        }
        return successMessage.OK(res, data)
    } catch (err) {
        console.log(err)
        return errorMessage.INTERNAL_SERVER_ERROR(res)
    }
})

module.exports = router;