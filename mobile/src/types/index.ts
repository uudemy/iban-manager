export interface IBAN {
  id: number;
  iban_number: string;
  bank_name: string;
  account_holder: string;
  description?: string;
  created_at: string;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface IBANValidationResponse {
  is_valid: boolean;
  formatted: string;
}

export type RootStackParamList = {
  Home: undefined;
  Add: undefined;
  Settings: undefined;
  EditIBAN: {iban: IBAN};
};

export type TabParamList = {
  Home: undefined;
  Add: undefined;
  Settings: undefined;
};
