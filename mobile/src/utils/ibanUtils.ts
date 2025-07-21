// IBAN formatting utilities

export const formatIBAN = (iban: string): string => {
  // Remove spaces and convert to uppercase
  const clean = iban.replace(/\s/g, '').toUpperCase();
  // Add spaces every 4 characters
  return clean.replace(/(.{4})/g, '$1 ').trim();
};

export const cleanIBAN = (iban: string): string => {
  // Remove all spaces and convert to uppercase
  return iban.replace(/\s/g, '').toUpperCase();
};

export const formatIBANInput = (value: string): string => {
  // Remove non-alphanumeric characters and convert to uppercase
  let cleanValue = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  
  // If empty or doesn't start with TR, add TR
  if (!cleanValue) {
    return 'TR';
  }
  
  if (!cleanValue.startsWith('TR')) {
    // If first character is digit, add TR
    if (/^\d/.test(cleanValue)) {
      cleanValue = 'TR' + cleanValue;
    } else if (cleanValue.startsWith('T') && cleanValue.length === 1) {
      cleanValue = 'TR';
    } else if (cleanValue.startsWith('T') && !cleanValue.startsWith('TR')) {
      cleanValue = 'TR' + cleanValue.substring(1);
    } else if (!cleanValue.startsWith('T')) {
      cleanValue = 'TR' + cleanValue;
    }
  }
  
  // Limit to 26 characters (Turkish IBAN length)
  cleanValue = cleanValue.substring(0, 26);
  
  // Format with spaces every 4 characters
  return cleanValue.replace(/(.{4})/g, '$1 ').trim();
};

export const isValidIBANLength = (iban: string): boolean => {
  const clean = cleanIBAN(iban);
  return clean.length === 26 && clean.startsWith('TR');
};

export const getIBANDisplayName = (bankName: string, accountHolder: string): string => {
  const maxBankLength = 15;
  const maxHolderLength = 20;
  
  const shortBank = bankName.length > maxBankLength 
    ? bankName.substring(0, maxBankLength) + '...' 
    : bankName;
    
  const shortHolder = accountHolder.length > maxHolderLength 
    ? accountHolder.substring(0, maxHolderLength) + '...' 
    : accountHolder;
    
  return `${shortBank} - ${shortHolder}`;
};
