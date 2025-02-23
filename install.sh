#!/bin/bash

# Update package list and install dependencies
sudo apt update
sudo apt install -y wget curl git openjdk-17-jdk

# Verify Java installation
java -version

# Install Node.js and npm using NodeSource
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install -y nodejs

# Install Hyperledger Besu
BESU_VERSION="23.4.1"
wget https://hyperledger.jfrog.io/artifactory/besu-binaries/besu/${BESU_VERSION}/besu-${BESU_VERSION}.tar.gz
tar -xzf besu-${BESU_VERSION}.tar.gz
sudo mv besu-${BESU_VERSION} /usr/local/bin/besu

# Create project directory structure
mkdir -p config data/{node1,node2,node3,node4} scripts contracts logs

# Generate JWT secret
openssl rand -hex 32 > config/jwt-secret.hex

# Set execute permissions
chmod +x scripts/*.sh

echo "Installation completed successfully!"
