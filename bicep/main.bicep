param location string = 'eastus'
param aksClusterName string = 'besu-cluster'
param nodeCount int = 4

module aks './aks.bicep' = {
  name: 'aksDeployment'
  params: {
    location: location
    clusterName: aksClusterName
    nodeCount: nodeCount
  }
}

module storage './storage.bicep' = {
  name: 'storageDeployment'
  params: {
    location: location
  }
}

module monitoring './monitoring.bicep' = {
  name: 'monitoringDeployment'
  params: {
    location: location
    clusterName: aksClusterName
  }
}
