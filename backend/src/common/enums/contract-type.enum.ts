export enum ContractType {
  JBCC = 'jbcc',
  NEC = 'nec',
  FIDIC = 'fidic',
  GCC = 'gcc',
  CUSTOM = 'custom',
}

export enum NoticeType {
  DELAY = 'delay',
  EXTENSION_OF_TIME = 'extension_of_time',
  VARIATION = 'variation',
  DISRUPTION = 'disruption',
  INSTRUCTION = 'instruction',
  FORCE_MAJEURE = 'force_majeure',
  PAYMENT = 'payment',
  TERMINATION = 'termination',
}

export enum NoticeStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  APPROVED = 'approved',
  SENT = 'sent',
  ACKNOWLEDGED = 'acknowledged',
  REJECTED = 'rejected',
  CLOSED = 'closed',
}

export enum ClaimStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  CLAIM_SENT = 'claim_sent',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  REQUIRES_AMENDMENT = 'requires_amendment',
  CLOSED = 'closed',
}

