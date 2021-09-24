var GoJetStaking = artifacts.require("GoJetStaking");
var GoJET = artifacts.require("GoJET");

module.exports = function(deployer) {
  // Testnet deploy
  // deployer.deploy(CyceSale, 
  //   "0x04772C8aFEb3bD4173d41feB3d0FC23C9e37af58",
  //   "0xd0a1e359811322d97991e03f863a0c30c2cf029c",
  //   "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
  //   "0xb7a4F3E9097C08dA09517b5aB877F7a917224ede"
  //   );
  // Mainnet deploy
  deployer.deploy(GoJET, "0x88a5203004DA51a403DA2d0fbEe931aCd34a1F35").then(function() {
      console.log("<===GoJET Token Address===>", GoJET.address);
      return deployer.deploy(GoJetStaking).then(function() {
        console.log("<===GoJetStaking Address===>", GoJetStaking.address);
        return deployer.deploy(GoJetStaking).then(function() {
          console.log("<===GoJetStaking Address===>", GoJetStaking.address);
          return deployer.deploy(GoJetStaking).then(function() {
            console.log("<===GoJetStaking Address===>", GoJetStaking.address);
          });
        });
      });
  });
};