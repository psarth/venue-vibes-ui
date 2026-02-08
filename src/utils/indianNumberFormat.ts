/**
 * Format number in Indian numbering system (lakhs and crores)
 * @param num - Number to format
 * @returns Formatted string with Indian comma placement
 */
export const formatIndianNumber = (num: number): string => {
  if (num === 0) return '0';
  
  const numStr = Math.abs(num).toString();
  const isNegative = num < 0;
  
  // For numbers less than 1000, no formatting needed
  if (Math.abs(num) < 1000) {
    return isNegative ? `-${numStr}` : numStr;
  }
  
  // Split into integer and decimal parts
  const parts = numStr.split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1] ? `.${parts[1]}` : '';
  
  // Apply Indian numbering system
  let formatted = '';
  
  if (integerPart.length > 3) {
    // Get last 3 digits
    const lastThree = integerPart.slice(-3);
    const remaining = integerPart.slice(0, -3);
    
    // Add commas every 2 digits for the remaining part
    let formattedRemaining = '';
    for (let i = remaining.length; i > 0; i -= 2) {
      const start = Math.max(0, i - 2);
      const chunk = remaining.slice(start, i);
      formattedRemaining = chunk + (formattedRemaining ? ',' + formattedRemaining : '');
    }
    
    formatted = formattedRemaining + ',' + lastThree;
  } else {
    formatted = integerPart;
  }
  
  return (isNegative ? '-' : '') + formatted + decimalPart;
};

/**
 * Format currency in Indian format with rupee symbol
 * @param amount - Amount to format
 * @returns Formatted currency string
 */
export const formatIndianCurrency = (amount: number): string => {
  return `₹${formatIndianNumber(amount)}`;
};