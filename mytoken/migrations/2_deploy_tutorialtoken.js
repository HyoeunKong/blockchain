var TutorialToken = artifacts.require("./Tutorialtoken.sol");

const _name = "TutorialToken";
const _symbol = "HYOEUN";
const _decimals = 10;
const _initialSupply = 10000;

module.exports = function(deployer) {
  deployer.deploy(TutorialToken, _name, _symbol, _decimals, _initialSupply);
};
