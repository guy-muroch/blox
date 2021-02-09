import ProcessClass from './process.class';
import Connection from '../common/store-manager/connection';
import WalletService from '../services/wallet/wallet.service';
import AccountService from '../services/account/account.service';
import KeyVaultService from '../services/key-vault/key-vault.service';
// analytics tools
import analytics from '../analytics';

export default class AccountCreateProcess extends ProcessClass {
  private readonly walletService: WalletService;
  private readonly accountService: AccountService;
  private readonly keyVaultService: KeyVaultService;
  public readonly actions: Array<any>;
  public readonly fallbackActions: Array<any>;

  constructor(network: string, indexToRestore?: number) {
    super('Account creation');
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
      }, {
        hook: async() => {
          await analytics.track('validator-created');
        }
      }
    ];

    this.fallbackActions = [
      {
        method: 'createBloxAccounts',
        actions: [
          {
            instance: this.keyVaultService,
            method: 'updateVaultStorage'
          },
          {
            hook: async() => {
              await analytics.track('error-occured', {
                reason: 'validator-creation-failed'
              });
            }
          }
        ]
      }
    ];

    const firstAction = {
      instance: null,
      method: null
    };
    if (indexToRestore != null) {
      // In case of import validators - create wallet from scratch
      firstAction.instance = this.walletService;
      firstAction.method = 'createWallet';
    } else {
      // In case of one validator creation - remove failed validator only
      firstAction.instance = this.accountService;
      firstAction.method = 'deleteLastIndexedAccount';
    }

    this.fallbackActions[0].actions.unshift(firstAction);
  }
}
