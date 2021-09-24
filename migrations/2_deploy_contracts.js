var GoJetStaking = artifacts.require("GoJetStaking");
var GoJET = artifacts.require("GoJET");

module.exports = function(deployer) {
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