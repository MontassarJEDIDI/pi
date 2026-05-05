export type AdjustmentType = 'OPTIMAL' | 'MONTEE' | 'DESCENTE';

export interface AdjustmentProposalResponse {
  userId: number;
  planActuelId: number;
  planActuelName: string;
  planActuelPrice: number;
  planRecommandeId: number;
  planRecommandeName: string;
  planRecommandePrice: number;
  typeAjustement: AdjustmentType;
  difference: number;
  justification: string;
  confidenceScore: number;
  checkDate: string;
}

