import ProcessClass from './process.class';
import Connection from '../common/store-manager/connection';
import AccountService from '../services/account/account.service';
import KeyVaultService from '../services/key-vault/key-vault.service';

export default class AccountCreateProcess extends ProcessClass {
  private readonly accountService: AccountService;
  private readonly keyVaultService: KeyVaultService;
  public readonly actions: Array<any>;
  public readonly fallbackActions: Array<any>;

  constructor(network: string, indexToRestore?: number) {
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
          indexToRestore
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
          indexToRestore
        }
      }
    ];

    this.fallbackActions = [
      {
        method: 'createBloxAccounts',
        actions: [
          {
            instance: this.accountService,
            /**
             * In case of issues we should remove:
             *  - one last indexed account if it was attempt to create validator
             *  - all accounts if it was attempt to import validators
             */
            method: indexToRestore != null ? 'deleteAllAccounts' : 'deleteLastIndexedAccount'
          },
          {
            instance: this.keyVaultService,
            method: 'updateVaultStorage'
          }
        ]
      }
    ];
  }
}
