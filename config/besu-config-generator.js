const NETWORK_TYPES = {
    IBFT2: 'ibft2',
    QBFT: 'qbft',
    CLIQUE: 'clique',
    ETHASH: 'ethash'
};

const PLUGINS = {
    PRIVACY: {
        name: 'privacy',
        class: 'org.hyperledger.besu.plugin.services.privacy.PrivateMarkerTransactionFactory'
    },
    METRICS: {
        name: 'metrics',
        class: 'org.hyperledger.besu.plugin.services.metrics.MetricsService'
    },
    TRACES: {
        name: 'traces',
        class: 'org.hyperledger.besu.plugin.services.trace.TraceService'
    }
};

class BesuConfigGenerator {
    constructor(networkType) {
        this.networkType = networkType;
        this.plugins = [];
        this.networkConfig = {};
    }

    addPlugin(pluginName) {
        if (PLUGINS[pluginName]) {
            this.plugins.push(PLUGINS[pluginName]);
        }
    }

    generateConfig() {
        return {
            network: {
                type: this.networkType,
                genesis: this.generateGenesis(),
                bootnodes: []
            },
            plugins: this.plugins,
            mining: this.getMiningConfig(),
            rpc: {
                enabled: true,
                host: "0.0.0.0",
                port: 8545,
                apis: ["ETH", "NET", "WEB3"]
            }
        };
    }

    generateGenesis() {
        switch(this.networkType) {
            case NETWORK_TYPES.IBFT2:
                return this.getIBFT2Genesis();
            case NETWORK_TYPES.QBFT:
                return this.getQBFTGenesis();
            // Add other cases
        }
    }
}

module.exports = { BesuConfigGenerator, NETWORK_TYPES, PLUGINS };
