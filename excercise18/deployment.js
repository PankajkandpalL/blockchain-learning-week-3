const { ethers } = require("hardhat");

async function main() {
    const AdvancedToken = await ethers.getContractFactory("AdvancedToken");
    const advancedToken = await AdvancedToken.deploy("AdvancedToken", "ADV", 1000000, 1000000000);
    await advancedToken.deployed();
  
    console.log("AdvancedToken deployed to:", advancedToken.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  