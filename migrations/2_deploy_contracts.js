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
  deployer.deploy(GoJET, 
    "0x4EFD33509c894A4D628a940cdcE10aBb4E2e1b94",
    "0x350571B512c9d5290364FbF2748d5f4fB399b459",
    "0xe977DFa9C58ec9057426D3b09b17b2c1E7a29b99",
    "0xdD9C6B59577E49Dafc39F37Ee99A115F4087a301",
    "0xdE243385be417C910BF06F620239c4D9F17BAEC3"
    ).then(function() {
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