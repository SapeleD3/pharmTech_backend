const Shelf = artifacts.require('./Shelf.sol');

module.exports = function(deployer) {
    deployer.deploy(Shelf);
};