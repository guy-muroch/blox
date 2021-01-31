import ProcessClass from './process.class';
import Connection from '../common/store-manager/connection';
import AccountService from '../services/account/account.service';
import KeyVaultService from '../services/key-vault/key-vault.service';

export default class AccountCreateProcess extends ProcessClass {
  private readonly accountService: AccountService;
  private readonly keyVaultService: KeyVaultService;
  public readonly actions: Array<any>;
  public readonly fallbackActions: Array<any>;

  constructor(network: string, accountsNumber?: number) {
    super();
    Connection.db().set('network', network);
    this.keyVaultService = new KeyVaultService();
    this.accountService = new AccountService();
    this.actions = [
      {
        instance: this.keyVaultService,
        method: 'importSlashingData'
      },
      {
        instance: this.accountService,
        method: 'createAccount',
        params: {
          getNextIndex: !accountsNumber,
          // indexToRestore should be >= 0 only, when accountsNumber can be undefined
          indexToRestore: accountsNumber ? accountsNumber - 1 : 0
        }
      },
      {
        instance: this.keyVaultService,
        method: 'updateVaultStorage'
      },
      {
        instance: this.accountService,
        method: 'createBloxAccounts',
        params: {
          // Accounts number here can be undefined or equal to highest index (i.e. accountsNumber - 1)
          accountsNumber: accountsNumber ? accountsNumber - 1 : accountsNumber
        }
      }
    ];

    this.fallbackActions = [
      {
        method: 'createBloxAccounts',
        actions: [
          { instance: this.accountService, method: 'deleteLastIndexedAccount' },
          { instance: this.keyVaultService, method: 'updateVaultStorage' }
        ]
      }
    ];
  }
}
