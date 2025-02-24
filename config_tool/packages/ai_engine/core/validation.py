from typing import Dict, Any, List
from dataclasses import dataclass

@dataclass
class ValidationResult:
    is_valid: bool
    risks: List[str]
    recommendations: List[str]
    score: float

class ConfigValidator:
    def __init__(self):
        self.risk_thresholds = {
            'high': 0.8,
            'medium': 0.6,
            'low': 0.4
        }

    def validate_configuration(self, config: Dict[str, Any]) -> ValidationResult:
        """Validate configuration and provide recommendations"""
        risks = []
        recommendations = []
        score = 100.0

        # Validate security settings
        security_score = self._validate_security(config, risks, recommendations)
        score *= security_score

        # Validate cloud configuration
        cloud_score = self._validate_cloud_config(config, risks, recommendations)
        score *= cloud_score

        # Validate deployment settings
        deploy_score = self._validate_deployment(config, risks, recommendations)
        score *= deploy_score

        return ValidationResult(
            is_valid=score >= 70.0,
            risks=risks,
            recommendations=recommendations,
            score=score
        )

    def _validate_security(self, config: Dict[str, Any], risks: List[str], 
                         recommendations: List[str]) -> float:
        """Validate security settings and return a score"""
        score = 1.0
        security = config['security']

        if config['environment'] == 'production':
            if not security['mfa']:
                risks.append('MFA not enabled in production')
                recommendations.append('Enable MFA for production environment')
                score *= 0.7
            if not security['hsm']:
                risks.append('HSM not configured in production')
                recommendations.append('Consider using HSM for key management')
                score *= 0.8

        return score

    def _validate_cloud_config(self, config: Dict[str, Any], risks: List[str], 
                             recommendations: List[str]) -> float:
        """Validate cloud provider configuration"""
        score = 1.0
        if len(config['cloudProviders']) == 0:
            risks.append('No cloud provider selected')
            score *= 0.5
        elif len(config['cloudProviders']) == 1:
            recommendations.append('Consider multi-cloud for high availability')
        return score

    def _validate_deployment(self, config: Dict[str, Any], risks: List[str], 
                           recommendations: List[str]) -> float:
        """Validate deployment configuration"""
        score = 1.0
        if config['environment'] == 'production':
            if not config['deployment']['kubernetes']:
                recommendations.append('Consider using Kubernetes for production')
                score *= 0.9
        return score
