import pytest
from core.predictor import ConfigPredictor

@pytest.fixture
def predictor():
    return ConfigPredictor()

def test_cost_estimation_multi_cloud():
    predictor = ConfigPredictor()
    config = {
        'environment': 'production',
        'cloudProviders': ['aws', 'gcp'],
        'deployment': {'kubernetes': True}
    }
    
    costs = predictor.estimate_costs(config)
    assert costs['total'] > 0
    assert all(k in costs for k in ['compute', 'storage', 'network'])

def test_risk_analysis_production():
    predictor = ConfigPredictor()
    config = {
        'environment': 'production',
        'security': {'mfa': False, 'hsm': True, 'rbac': True}
    }
    
    risks = predictor.analyze_risks(config)
    assert any('MFA' in rec['suggestion'] for rec in risks['recommendations'])
    assert risks['security_score'] < 90  # Should be penalized for missing MFA

def test_optimization_recommendations():
    predictor = ConfigPredictor()
    config = {
        'environment': 'production',
        'cloudProviders': ['aws'],
        'deployment': {'kubernetes': True}
    }
    
    recommendations = predictor._generate_recommendations(config)
    assert any(rec['type'] == 'cost' for rec in recommendations)
