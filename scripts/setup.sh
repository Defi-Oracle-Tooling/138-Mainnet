#!/bin/bash

echo "🚀 Setting up Hyperledger Besu & Smart Contracts on Azure..."

# Load environment variables
source .env

# Install dependencies
sudo apt update && sudo apt install -y nodejs npm docker.io azure-cli

# Generate network configuration
echo "📝 Generating Besu configuration..."
node config/besu-config-generator.js --network=ibft2 --plugins=metrics,traces

# Install required plugins
./scripts/plugin-manager.sh install metrics ${METRICS_PLUGIN_URL}
./scripts/plugin-manager.sh install traces ${TRACES_PLUGIN_URL}

# Pull and configure Besu
docker pull hyperledger/besu:latest
docker run -d --name besu-node \
  -v $(pwd)/config:/config \
  -v $(pwd)/data:/data \
  -p 30303:30303 -p 8545:8545 \
  hyperledger/besu \
  --config-file=/config/besu-config.toml

# Deploy contracts
npm install -g truffle
cd contracts
truffle migrate --network besu

# Setup Azure Logic App with enhanced configuration
az logicapp create \
  --resource-group besu-rg \
  --name BesuDeploymentLogicApp \
  --definition @../logicapp/workflow.json \
  --parameters besuVersion=${BESU_VERSION} \
              pluginsEnabled=true

echo "✅ Deployment Complete!"
