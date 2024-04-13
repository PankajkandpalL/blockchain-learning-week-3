const { expect } = require("chai");

describe("AdvancedToken", function () {
  let AdvancedToken;
  let advancedToken;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    AdvancedToken = await ethers.getContractFactory("AdvancedToken");
    [owner, addr1, addr2] = await ethers.getSigners();
    advancedToken = await AdvancedToken.deploy("AdvancedToken", "ADV", 1000000, 1000000000);
    await advancedToken.deployed();
  });

  it("Should mint tokens correctly and reflect in balance", async function () {
    await advancedToken.connect(owner).mint(addr1.address, 100);
    const balance = await advancedToken.balanceOf(addr1.address);
    expect(balance).to.equal(100);
  });

  it("Should not allow minting beyond maximum supply", async function () {
    await expect(advancedToken.connect(owner).mint(addr1.address, 1000000001)).to.be.revertedWith("Exceeds max supply");
  });

  it("Should allow users to burn their tokens and reflect reduced total supply", async function () {
    await advancedToken.connect(owner).mint(addr1.address, 100);
    await advancedToken.connect(addr1).burn(50);
    const totalSupply = await advancedToken.totalSupply();
    const balance = await advancedToken.balanceOf(addr1.address);
    expect(totalSupply).to.equal(999950);
    expect(balance).to.equal(50);
  });

  it("Should allow locking and unlocking tokens correctly", async function () {
    await advancedToken.connect(owner).lockTokens(addr1.address, 100, 86400); 
    const lockedBalance = await advancedToken.lockedBalanceOf(addr1.address);
    const lockTimestamp = await advancedToken.lockTimestampOf(addr1.address);
    expect(lockedBalance).to.equal(100);
    expect(lockTimestamp).to.be.gt(0);
  });

  it("Should not allow transfer of locked tokens", async function () {
    await advancedToken.connect(owner).mint(addr1.address, 100);
    await advancedToken.connect(owner).lockTokens(addr1.address, 100, 86400); 
    await expect(advancedToken.connect(addr1).transfer(addr2.address, 50)).to.be.revertedWith("Transfer of locked tokens is not allowed");
  });

  it("Should not allow burning locked tokens", async function () {
    await advancedToken.connect(owner).mint(addr1.address, 100);
    await advancedToken.connect(owner).lockTokens(addr1.address, 100, 86400); 
    await expect(advancedToken.connect(addr1).burn(50)).to.be.revertedWith("No tokens locked");
  });
});
