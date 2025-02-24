import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from typing import Dict, Any, Tuple

class ModelTrainer:
    def __init__(self):
        self.cost_model = RandomForestRegressor(n_estimators=100)
        self.risk_model = RandomForestClassifier(n_estimators=100)
        self.performance_model = RandomForestRegressor(n_estimators=100)

    def prepare_training_data(self, historical_data: list) -> Tuple[np.ndarray, np.ndarray]:
        """Convert historical configuration data into training features"""
        features = []
        cost_labels = []
        
        for entry in historical_data:
            feature_vector = self._extract_features(entry['config'])
            features.append(feature_vector)
            cost_labels.append(entry['actual_cost'])
            
        return np.array(features), np.array(cost_labels)

    def train_models(self, training_data: list):
        """Train all prediction models"""
        X, y_cost = self.prepare_training_data(training_data)
        X_train, X_test, y_train, y_test = train_test_split(X, y_cost, test_size=0.2)

        # Train cost prediction model
        self.cost_model.fit(X_train, y_train)
        cost_score = self.cost_model.score(X_test, y_test)

        return {
            'cost_model_accuracy': cost_score,
            'training_size': len(X_train)
        }

    def _extract_features(self, config: Dict[str, Any]) -> np.ndarray:
        """Extract numerical features from configuration"""
        features = []
        
        # Environment type
        features.append(1 if config['environment'] == 'production' else 0)
        
        # Cloud providers count
        features.append(len(config['cloudProviders']))
        
        # Security features
        features.append(sum([
            config['security']['mfa'],
            config['security']['hsm'],
            config['security']['rbac']
        ]))
        
        # Deployment features
        features.append(1 if config['deployment']['kubernetes'] else 0)
        
        return np.array(features)
