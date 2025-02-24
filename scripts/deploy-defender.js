const { Client } = require('@openzeppelin/defender-sdk');
const { ethers } = require("hardhat");

async function main() {
    const credentials = {
        apiKey: process.env.DEFENDER_TEAM_API_KEY,
        apiSecret: process.env.DEFENDER_TEAM_API_SECRET,
    };

    const client = new Client(credentials);
    const contract = await ethers.getContractFactory("CCIPToken");
    
    const deployment = await client.deploy({
        contract: contract,
        network: 'polygon',
        constructorArgs: ["YOUR_ROUTER_ADDRESS"],
        verify: true
    });

    console.log("Contract deployed to:", deployment.address);
}

main()
    .then(() => process.exit(0))
    .catch(console.error);
