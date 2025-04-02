import {DrcProject} from 'infoportal-common'

export enum ShelterProgress {
  ContractorVisitDone = 'ContractorVisitDone',
  WorkEstimatesReceived = 'WorkEstimatesReceived',
  PurchaseRequestDone = 'PurchaseRequestDone',
  WorkOrderDone = 'WorkOrderDone',
  RepairWorksStarted = 'RepairWorksStarted',
  RepairWorksCompleted = 'RepairWorksCompleted',
  ContractorInvoiceReceived = 'ContractorInvoiceReceived',
  HandoverCertificateOfCompletionSigned = 'HandoverCertificateOfCompletionSigned',
  InvoicePaymentProcessed = 'InvoicePaymentProcessed',
}

export enum ShelterTagValidation {
  Accepted = 'Accepted',
  Rejected = 'Rejected',
  Pending = 'Pending',
}

export interface ShelterNtaTags {
  validation?: ShelterTagValidation
}

export interface ShelterTaTags {
  progress?: ShelterProgress
  contractor1?: any
  contractor2?: any
  agreement?: string
  workOrder?: string
  donor?: string
  project?: DrcProject[]
  workDoneAt?: Date
}
