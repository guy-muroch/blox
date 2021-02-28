import keyVaultImage from '../../../../Wizard/assets/img-key-vault.svg';
import keyVaultInactiveImage from '../../../../Wizard/assets/img-key-vault-inactive.svg';

const getNumberColor = (number: number) => {
  if (!Number.isNaN(number)) {
    if (number > 0) {
      return 'accent2400';
    }
    if (number < 0) {
      return 'destructive700';
    }
  }
  return 'gray800';
};

const trimWholeNumber = (floatingNumber: number) => {
  if (Number.isNaN(floatingNumber)) { return 'N/A'; }
  const number = floatingNumber > 0 ? Math.floor(floatingNumber) : Math.ceil(floatingNumber);
  return number.toLocaleString();
};

export const trimDecimalNumber = (floatingNumber: number, isPercents: boolean) => {
  if (Number.isNaN(floatingNumber)) { return 'N/A'; }
  let toFixed = 5;
  if (floatingNumber >= 10 || isPercents) { toFixed = 2; }

  const trimmedDecimal = (floatingNumber % 1).toFixed(toFixed).substring(2);
  return floatingNumber >= 0 ? `.${trimmedDecimal}` : trimmedDecimal;
};

export const getBoxes = (isActive: boolean, summary: Record<string, any>) => {
  return [
    {
      name: 'totalBalance',
      width: '290px',
      color: !summary?.balance ? 'gray600' : 'gray800',
      bigText: !summary?.balance ? 'N/A' : trimWholeNumber(summary.balance),
      medText: !summary?.balance ? '' : `${trimDecimalNumber(summary.balance, false)}`,
      tinyText: 'Total Balance',
    },
    {
      name: 'sinceStart',
      width: '260px',
      color: !summary?.balance ? 'gray600' : getNumberColor(summary.sinceStart),
      bigText: !summary?.balance ? 'N/A' : trimWholeNumber(summary.sinceStart),
      medText: !summary?.balance ? '' : `${trimDecimalNumber(summary.sinceStart, false)}`,
      tinyText: 'Since Start',
    },
    {
      name: 'change',
      width: '220px',
      color: !summary?.balance ? 'gray600' : getNumberColor(summary.totalChange),
      bigText: !summary?.balance ? 'N/A' : trimWholeNumber(summary.totalChange),
      medText: !summary?.balance ? '' : `${trimDecimalNumber(summary.totalChange, true)}`,
      tinyText: 'Change',
    },
    {
      name: 'keyvault',
      width: '330px',
      color: isActive ? 'accent2400' : 'destructive700',
      bigText: isActive ? 'Active' : 'Inactive',
      tinyText: 'KeyVault',
      image: isActive ? keyVaultImage : keyVaultInactiveImage,
    },
  ];
};
