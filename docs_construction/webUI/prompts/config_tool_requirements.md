# Enterprise-Grade Config Tool Requirements Prompt

You are tasked with developing a state-of-the-art configuration tool that meets enterprise standards. The tool must have these key characteristics:

## Core Requirements

1. Architecture:
- Implement a modular microservices architecture
- Support both CLI and Web UI interfaces
- Enable real-time configuration validation
- Provide seamless multi-cloud deployment capabilities
- Include blockchain-based audit logging

2. Technical Features:
- Advanced Boolean logic processing (AND/OR/NAND/NOR)
- Context-aware configuration options
- Real-time cost estimation and optimization
- Security compliance automation (GDPR, FATF, ISO 27001)
- Infrastructure-as-Code integration (Terraform, Ansible)

3. AI Integration:
- Cost prediction and optimization
- Security risk assessment
- Resource scaling recommendations
- Configuration validation
- Performance optimization suggestions

4. Security Features:
- Zero-knowledge proof validation
- Hardware Security Module (HSM) integration
- Multi-factor authentication
- Role-based access control
- Immutable audit logging

5. Deployment Capabilities:
- Multi-cloud support (AWS, GCP, Azure, OCI)
- Kubernetes orchestration
- Blockchain network deployment
- Hybrid cloud configurations
- Automated failover strategies

## Implementation Guidelines

Create a config tool that:
1. Uses modern tech stack (React, Node.js, Python)
2. Implements enterprise-grade security
3. Provides AI-driven optimization
4. Enables automated deployment
5. Ensures regulatory compliance
6. Maintains detailed audit trails

The solution should prioritize:
- Scalability
- Security
- User experience
- Performance
- Maintainability
- Compliance
- Cost optimization

Output should include:
1. Configuration validation rules
2. Deployment templates
3. Security protocols
4. Cost estimates
5. Risk assessments
6. Compliance reports

Use this format for configuration:
```yaml
deployment:
  environment: <dev|test|prod>
  type: <cloud|multi-cloud|hybrid>
  providers:
    - name: <provider>
      region: <region>
      resources:
        compute: <specs>
        storage: <specs>
        network: <specs>
  security:
    compliance: [<standards>]
    authentication: <methods>
    encryption: <specs>
  monitoring:
    metrics: [<list>]
    alerts: [<rules>]
  scaling:
    auto: <boolean>
    rules: [<conditions>]
```

Consider all aspects from phase_1.md documentation and implement enterprise best practices for configuration management and deployment automation.
