import { compareFunction } from '../../../../../../common/components/Table/service';

export default [
  {
    key: 'name',
    title: '#',
    width: '10%',
    justifyContent: 'flex-start',
    compareFunction: (a, b, dir) => compareFunction('name', a, b, dir, 'string'),
    valueRender: (index) => {
      const indexStr = index.replace('account-', '');
      return String(parseInt(indexStr, 10) + 1).padStart(3, '0');
    },
  },
  {
    key: 'validationPubKey',
    title: 'Validator',
    width: '90%',
    justifyContent: 'flex-end',
    compareFunction: (a, b, dir) => compareFunction('validationPubKey', a, b, dir, 'string'),
    valueRender: (validator) => `0x${validator}`
  }
];
