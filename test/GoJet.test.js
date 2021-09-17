const {
  expectRevert,
  time
} = require('@openzeppelin/test-helpers');
const {
  assert
} = require('chai');
const GoJET = artifacts.require('GoJET');
const BN = require("bignumber.js");
BN.config({
  ROUNDING_MODE: BN.ROUND_DOWN
});

contract('GoJet', async ([alice, bob, admin, dev, minter]) => {
  beforeEach(async () => {
    this.rewardToken = await GoJET.new({
      from: minter
    });
  });

  it('should equal params', async () => {
    let totalSupply = await this.rewardToken.totalSupply();
    assert.equal(totalSupply.toString(), '100000000000000000000000000', 'Total supply is not equal');
    let balanceOfMinter = await this.rewardToken.balanceOf(minter);
    assert.equal(balanceOfMinter.toString(), '100000000000000000000000000', 'Balance of minter is not equal');
    let symbol = await this.rewardToken.symbol();
    assert.equal(symbol, "JET", "symbol is not equal");
    let tokenName = await this.rewardToken.name();
    assert.equal(tokenName, "GoJET", "Token name is not equal");
  });

  it('should transfer tokens; raffle concept', async () => {
    await this.rewardToken.transfer(alice, new BN(100*10**18), {
      from: minter
    });
    let aliceBalance = await this.rewardToken.balanceOf(alice);
    let bobBalance = await this.rewardToken.balanceOf(bob);
    console.log({
      aliceBalance: aliceBalance.toString()
    });
    console.log({
      bobBalance: bobBalance.toString()
    });
    assert.equal(aliceBalance.toString(), "94000000000000000000", "Alice Balance is not 100 JET token");
    assert.equal(bobBalance.toString(), "0", "Bob Balance is not 0 JET token");
    await this.rewardToken.draw({
      from: minter
    });
    let awaitingDraw = await this.rewardToken.awaitingDraw();

    assert.equal(awaitingDraw, false, "awaitingDraw is not false");
    await this.rewardToken.approve(bob, new BN(50*10**18), {
      from: alice
    });
    await this.rewardToken.transferFrom(alice, bob, new BN(10*10**18), {
      from: bob
    });
    aliceBalance = await this.rewardToken.balanceOf(alice);
    bobBalance = await this.rewardToken.balanceOf(bob);
    let minterBalance = await this.rewardToken.balanceOf(minter);
    console.log({
      minterBalance: minterBalance.toString()
    });
    console.log({
      aliceBalance: aliceBalance.toString()
    });
    console.log({
      bobBalance: bobBalance.toString()
    });
    assert.equal(aliceBalance.toString(), "84000000000000000000", "Alice Balance is not 84 JET token");
    assert.equal(bobBalance.toString(), "9400000000000000000", "Bob Balance is not 9.4 JET token");
    await this.rewardToken.draw({
      from: minter
    });
    awaitingDraw = await this.rewardToken.awaitingDraw();

    assert.equal(awaitingDraw, true, "awaitingDraw is not true");
    await expectRevert(
      this.rewardToken.approve(bob, 10, {
        from: alice
      }),
      'Draw is not started'
    );
    await expectRevert(
      this.rewardToken.draw({
        from: alice
      }),
      'Ownable: caller is not the owner'
    );
  });
});