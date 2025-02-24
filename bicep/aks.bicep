param location string
param clusterName string
param nodeCount int

resource aksCluster 'Microsoft.ContainerService/managedClusters@2023-01-01' = {
  name: clusterName
  location: location
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    dnsPrefix: clusterName
    agentPoolProfiles: [
      {
        name: 'nodepool1'
        count: nodeCount
        vmSize: 'Standard_D4s_v3'
        mode: 'System'
      }
    ]
    networkProfile: {
      networkPlugin: 'azure'
      networkPolicy: 'calico'
    }
  }
}
