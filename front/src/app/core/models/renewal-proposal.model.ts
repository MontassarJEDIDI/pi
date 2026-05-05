import { AdjustmentProposalResponse } from './adjustment-proposal.model';

export interface RenewalProposalResponse {
  subscriptionId: number;
  userId: number;
  currentEndDate: string;
  autoRenew: boolean;
  proposal: AdjustmentProposalResponse;
}

export interface ConfirmRenewalRequest {
  acceptSuggestion: boolean;
}

