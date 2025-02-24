import pytest
from core.validation import ConfigValidator, ValidationResult

def test_validate_production_config():
    validator = ConfigValidator()
    config = {
        'environment': 'production',
        'cloudProviders': ['aws', 'gcp'],
        'security': {
            'mfa': True,
            'hsm': True,
            'rbac': True
        },
        'deployment': {
            'kubernetes': True
        }
    }
    
    result = validator.validate_configuration(config)
    assert isinstance(result, ValidationResult)
    assert result.is_valid
    assert result.score > 90.0

def test_validate_missing_security():
    validator = ConfigValidator()
    config = {
        'environment': 'production',
        'cloudProviders': ['aws'],
        'security': {
            'mfa': False,
            'hsm': False,
            'rbac': True
        },
        'deployment': {
            'kubernetes': False
        }
    }
    
    result = validator.validate_configuration(config)
    assert not result.is_valid
    assert any('MFA not enabled' in risk for risk in result.risks)
