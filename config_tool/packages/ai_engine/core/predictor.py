import numpy as np
import pandas as pd
from typing import Dict, Any
from sklearn.ensemble import RandomForestRegressor
from .constants import CLOUD_COSTS, RISK_FACTORS

class ConfigPredictor:
    def __init__(self):
        self.cost_model = RandomForestRegressor()
        self.risk_model = RandomForestRegressor()
        
    def estimate_costs(self, config: Dict[str, Any]) -> Dict[str, float]:
        """Estimate deployment costs based on configuration"""
        costs = {
            'compute': self._estimate_compute_costs(config),
            'storage': self._estimate_storage_costs(config),
            'network': self._estimate_network_costs(config),
            'total': 0.0
        }
        costs['total'] = sum(costs.values())
        return costs
    
    def analyze_risks(self, config: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze security and operational risks"""
        risks = {
            'security_score': self._calculate_security_score(config),
            'compliance_score': self._calculate_compliance_score(config),
            'reliability_score': self._calculate_reliability_score(config),
            'recommendations': self._generate_recommendations(config)
        }
        return risks
    
    def _calculate_security_score(self, config: Dict[str, Any]) -> float:
        """Calculate security risk score"""
        base_score = 100.0
        risk_factors = RISK_FACTORS.get('security', {})
        
        for factor, impact in risk_factors.items():
            if not config.get(factor, False):
                base_score -= impact
                
        return max(0.0, min(100.0, base_score))
    
    def _generate_recommendations(self, config: Dict[str, Any]) -> list:
        """Generate optimization recommendations"""
        recommendations = []
        
        # Cost optimizations
        if self._can_optimize_costs(config):
            recommendations.append({
                'type': 'cost',
                'suggestion': 'Consider using reserved instances for stable workloads',
                'potential_savings': '20-30%'
            })
            
        # Security enhancements
        security_score = self._calculate_security_score(config)
        if security_score < 80:
            recommendations.append({
                'type': 'security',
                'suggestion': 'Enable additional security features (MFA, HSM)',
                'impact': 'High'
            })
            
        return recommendations

    def _can_optimize_costs(self, config: Dict[str, Any]) -> bool:
        """Check if cost optimization is possible"""
        return any([
            len(config.get('cloudProviders', [])) > 1,
            config.get('environment') == 'production',
            config.get('deployment', {}).get('kubernetes', False)
        ])
