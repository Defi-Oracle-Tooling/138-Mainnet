const { ethers } = require("hardhat");

async function main() {
    const routerAddress = "YOUR_ROUTER_ADDRESS"; // Replace with actual router address
    
    const CCIPToken = await ethers.getContractFactory("CCIPToken");
    const token = await CCIPToken.deploy(routerAddress);
    
    await token.deployed();
    
    console.log("CCIP Token deployed to:", token.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
