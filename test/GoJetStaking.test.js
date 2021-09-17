const {
    expectRevert,
    time
} = require('@openzeppelin/test-helpers');
const {
    assert
} = require('chai');
const BN = require("bignumber.js")
const GoJET = artifacts.require('GoJET');
const GoJetStaking = artifacts.require('GoJetStaking');
BN.config({
    ROUNDING_MODE: BN.ROUND_DOWN
})

contract('GoJetStaking', async ([alice, bob, admin, dev, minter]) => {
    beforeEach(async () => {
        this.rewardToken = await GoJET.new({
            from: minter
        });
        this.stakingContract = await GoJetStaking.new({
            from: minter,
        });
        console.log({
            stakingContract: this.stakingContract.address
        })
        await this.stakingContract.initialize(
            this.rewardToken.address,
            this.rewardToken.address,
            new BN(21879755787037037000),
            200,
            864200,
            0,
            new BN(250000000000000000000000),
            minter, {
                from: minter
            });
        console.log("========== initialized =============");
        await this.rewardToken.transfer(this.stakingContract.address, new BN(18904109589041095000000000), {
            from: minter
        });
        console.log("========== add reward token =============");
    });

    it('check initial params', async  () => {
        const rewardTokenBalance = await this.rewardToken.balanceOf(this.stakingContract.address);
        console.log({rewardTokenBalance: rewardTokenBalance.toString()});
        assert.equal(rewardTokenBalance.toString(), '18904109589041095000000000', 'Did not send right amount of token');
        const accTokenPerShare = await this.stakingContract.accTokenPerShare();
        console.log({
            accTokenPerShare: accTokenPerShare.toString()
        });
        const initialized = await this.stakingContract.isInitialized();
        assert.equal(initialized, true, "Not initialized");
        const PRECISION_FACTOR = await this.stakingContract.PRECISION_FACTOR();
        console.log({
            PRECISION_FACTOR: PRECISION_FACTOR.toString()
        });
        const totalStakingTokens = await this.stakingContract.totalStakingTokens();
        console.log({totalStakingTokens: totalStakingTokens.toString()});
        const totalRewardTokens = await this.stakingContract.totalRewardTokens();
        console.log({totalRewardTokens: totalRewardTokens.toString()});
        const freezeStartBlock = await this.stakingContract.freezeStartBlock();
        console.log({freezeStartBlock: freezeStartBlock.toString()});
        const freezeEndBlock = await this.stakingContract.freezeEndBlock();
        console.log({freezeEndBlock: freezeEndBlock.toString()});
        const SMART_CHEF_FACTORY = await this.stakingContract.SMART_CHEF_FACTORY();
        assert.equal(SMART_CHEF_FACTORY, minter, "Not equal as minter");
        const isFrozen = await this.stakingContract.isFrozen();
        console.log({isFrozen});
        assert.equal(isFrozen, false, "isFrozen is true");
    });

    it('deposit/withdraw', async () => {
        await this.rewardToken.draw({from: minter});
        await this.rewardToken.transfer(alice, new BN(765000*10**18), {from: minter});
        await this.rewardToken.transfer(bob, new BN(510000*10**18), {from: minter});
        await this.rewardToken.approve(this.stakingContract.address, new BN(765000*10**18), {from: alice});
        await this.rewardToken.approve(this.stakingContract.address, new BN(510000*10**18), {from: bob});
        let totalStakingTokens = await this.stakingContract.totalStakingTokens();
        console.log({totalStakingTokens: totalStakingTokens.toString()});
        await this.stakingContract.deposit('255000000000000000000000', {from: alice});
        console.log("==========alice deposit 255000 GoJET============");
        let accTokenPerShare = await this.stakingContract.accTokenPerShare();
        console.log({
            accTokenPerShare: accTokenPerShare.toString()
        });
        let pendingRewardAlice = await this.stakingContract.pendingReward(alice);
        console.log({pendingRewardAlice: pendingRewardAlice.toString()});
        totalStakingTokens = await this.stakingContract.totalStakingTokens();
        console.log({totalStakingTokens: totalStakingTokens.toString()});
        console.log("==========bob deposit 255000 GoJET============");
        await this.stakingContract.deposit(new BN(255000*10**18), {from: bob});
        let latestBlock = await time.latestBlock();
        console.log({latestBlock: latestBlock.toString()});
        pendingRewardAlice = await this.stakingContract.pendingReward(alice);
        console.log({pendingRewardAlice: pendingRewardAlice.toString()});
        let pendingRewardBob = await this.stakingContract.pendingReward(bob);
        console.log({pendingRewardBob: pendingRewardBob.toString()});
        accTokenPerShare = await this.stakingContract.accTokenPerShare();
        console.log({
            accTokenPerShare: accTokenPerShare.toString()
        });
        totalStakingTokens = await this.stakingContract.totalStakingTokens();
        console.log({totalStakingTokens: totalStakingTokens.toString()});
        await this.stakingContract.deposit(new BN(255000*10**18), {from: alice});
        accTokenPerShare = await this.stakingContract.accTokenPerShare();
        console.log({
            accTokenPerShare: accTokenPerShare.toString()
        });
        await this.stakingContract.deposit(new BN(255000*10**18), {from: bob});
        accTokenPerShare = await this.stakingContract.accTokenPerShare();
        console.log({
            accTokenPerShare: accTokenPerShare.toString()
        });
        await this.stakingContract.deposit(new BN(255000*10**18), {from: alice});
        console.log("==========alice, bob deposit again 255000 GoJET================");
        latestBlock = await time.latestBlock();
        console.log({latestBlock: latestBlock.toString()});
        pendingRewardAlice = await this.stakingContract.pendingReward(alice);
        pendingRewardBob = await this.stakingContract.pendingReward(bob);
        console.log({pendingRewardAlice: pendingRewardAlice.toString()});
        console.log({pendingRewardBob: pendingRewardBob.toString()});
        accTokenPerShare = await this.stakingContract.accTokenPerShare();
        console.log({
            accTokenPerShare: accTokenPerShare.toString()
        });
        totalStakingTokens = await this.stakingContract.totalStakingTokens();
        console.log({totalStakingTokens: totalStakingTokens.toString()});
        let balanceStakingContract = await this.rewardToken.balanceOf(this.stakingContract.address);
        console.log({balanceStakingContract: balanceStakingContract.toString()});
        // Withdraw 
        await time.advanceBlockTo(500);
        latestBlock = await time.latestBlock();
        console.log({latestBlock: latestBlock.toString()});
        await this.stakingContract.withdraw(new BN(255000*10**18), {from: alice});
        accTokenPerShare = await this.stakingContract.accTokenPerShare();
        console.log({
            accTokenPerShare: accTokenPerShare.toString()
        });
        await this.stakingContract.withdraw(new BN(255000*10**18), {from: bob});
        accTokenPerShare = await this.stakingContract.accTokenPerShare();
        console.log({
            accTokenPerShare: accTokenPerShare.toString()
        });
        pendingRewardAlice = await this.stakingContract.pendingReward(alice);
        pendingRewardBob = await this.stakingContract.pendingReward(bob);
        console.log({pendingRewardAlice: pendingRewardAlice.toString()});
        console.log({pendingRewardBob: pendingRewardBob.toString()});
        balanceStakingContract = await this.rewardToken.balanceOf(this.stakingContract.address);
        console.log({balanceStakingContract: balanceStakingContract.toString()});

        let tokenBalanceAlice = await this.rewardToken.balanceOf(alice);
        let tokenBalanceBob = await this.rewardToken.balanceOf(bob);
        console.log({tokenBalanceAlice: tokenBalanceAlice.toString()});
        console.log({tokenBalanceBob: tokenBalanceBob.toString()});
    });
});