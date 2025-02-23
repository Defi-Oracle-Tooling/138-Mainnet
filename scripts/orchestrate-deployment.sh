#!/bin/bash

# Configuration
NETWORK_TYPE=${1:-ibft2}
PLUGINS=${2:-"metrics,traces"}
BESU_VERSION=${3:-"latest"}

# Setup environment
echo "🔧 Setting up environment..."
cat > .env << EOF
NETWORK_TYPE=${NETWORK_TYPE}
BESU_VERSION=${BESU_VERSION}
METRICS_PLUGIN_URL=https://hyperledger.jfrog.io/artifactory/besu-plugins/metrics-plugin.jar
TRACES_PLUGIN_URL=https://hyperledger.jfrog.io/artifactory/besu-plugins/traces-plugin.jar
EOF

# Generate configurations
echo "📝 Generating configurations..."
node config/besu-config-generator.js \
  --network=${NETWORK_TYPE} \
  --plugins=${PLUGINS}

# Deploy infrastructure
echo "🚀 Deploying Azure infrastructure..."
az deployment group create \
  --resource-group besu-rg \
  --template-file azure/template.json \
  --parameters networkType=${NETWORK_TYPE} \
              enabledPlugins=${PLUGINS} \
              besuVersion=${BESU_VERSION}

# Deploy Besu and plugins
echo "⚙️ Running setup script..."
./scripts/setup.sh

# Deploy smart contracts
echo "📜 Deploying smart contracts..."
npm run deploy:contracts

echo "✅ Deployment orchestration complete!"
