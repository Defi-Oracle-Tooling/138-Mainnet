#!/bin/bash

PLUGIN_DIR="/opt/besu/plugins"
DOWNLOAD_DIR="/tmp/besu-plugins"

function install_plugin() {
    local plugin_name=$1
    local plugin_url=$2
    
    mkdir -p $DOWNLOAD_DIR
    mkdir -p $PLUGIN_DIR

    echo "📥 Downloading $plugin_name plugin..."
    curl -L $plugin_url -o "$DOWNLOAD_DIR/$plugin_name.jar"

    echo "📦 Installing $plugin_name plugin..."
    mv "$DOWNLOAD_DIR/$plugin_name.jar" "$PLUGIN_DIR/"
}

function configure_plugin() {
    local plugin_name=$1
    case $plugin_name in
        "privacy")
            echo "🔒 Configuring privacy plugin..."
            cat > privacy-config.toml << EOF
privacy-enabled=true
privacy-multi-tenancy-enabled=true
privacy-tls-enabled=true
privacy-onchain-groups-enabled=true
EOF
            ;;
        "metrics")
            echo "📊 Configuring metrics plugin..."
            cat > metrics-config.toml << EOF
metrics-enabled=true
metrics-host="0.0.0.0"
metrics-port=9545
EOF
            ;;
    esac
}

# Main plugin installation logic
case $1 in
    "install")
        install_plugin $2 $3
        configure_plugin $2
        ;;
    "remove")
        rm -f "$PLUGIN_DIR/$2.jar"
        ;;
    "list")
        ls -l $PLUGIN_DIR
        ;;
esac
