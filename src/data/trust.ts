export interface TrustPillar {
  title: string;
  description: string;
  commitments: string[];
}

export interface TrustPractice {
  title: string;
  items: string[];
}

export interface TrustSignal {
  label: string;
  value: string;
  description: string;
}

export const trustPillars: TrustPillar[] = [
  {
    title: 'Responsible AI Craftsmanship',
    description:
      'Every feature is reviewed against ethical guidelines before it ships so experiments never come at the expense of people.',
    commitments: [
      'Scenario reviews map intended and unintended use cases',
      'Bias and fairness checkpoints are embedded into QA pipelines',
      'Red-team drills to stress-test models against abuse patterns'
    ]
  },
  {
    title: 'Security by Architecture',
    description:
      'Security controls are wired into the architecture from the first design doc—no patchwork hardening after launch.',
    commitments: [
      'Zero-trust defaults with least-privilege automation',
      'End-to-end encryption and audit trails for every integration',
      'Continuous dependency health monitoring with rapid patch SLAs'
    ]
  },
  {
    title: 'Human-Centered Transparency',
    description:
      'People stay in control with clear consent boundaries, explainable decisions, and reversible choices built into UX.',
    commitments: [
      'Layered privacy notices written for humans, not lawyers',
      'Model cards explain the what, why, and limits of each release',
      'Every data touchpoint is opt-in with granular controls'
    ]
  }
];

export const trustPractices: TrustPractice[] = [
  {
    title: 'Operational Guardrails',
    items: [
      'Automated policy linting in CI/CD to block unsafe merges',
      'Four-eyes review for production prompts, datasets, and configs',
      'Post-incident learning loops with published remediation notes'
    ]
  },
  {
    title: 'Privacy Engineering',
    items: [
      'Differential privacy toggles for analytics and telemetry',
      'Data minimization scripts purge unused artifacts every sprint',
      'Data Processing Agreements pre-negotiated for partner launches'
    ]
  },
  {
    title: 'Inclusive Research',
    items: [
      'Co-design sessions with diverse domain experts before launch',
      'Accessibility scoring baked into definition-of-done checklists',
      'Impact assessments shared with stakeholders at alpha, beta, GA'
    ]
  }
];

export const trustSignals: TrustSignal[] = [
  {
    label: 'Security Certifications',
    value: 'SOC 2 Type II ready',
    description: 'Controls mapped to the SOC 2 trust principles with auditor-ready evidence lockers.'
  },
  {
    label: 'Privacy Governance',
    value: 'GDPR & HIPAA aligned',
    description: 'Data flows documented with ROPA inventories, DPIAs, and breach playbooks.'
  },
  {
    label: 'Uptime Confidence',
    value: '99.9% target',
    description: 'Site reliability rotations, chaos drills, and automatic rollback strategies keep the lights on.'
  }
];
