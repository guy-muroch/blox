import ProcessClass from './process.class';
import Connection from '../common/store-manager/connection';
import KeyManagerService from '../services/key-manager/key-manager.service';

export default class ImportValidatorsProcess extends ProcessClass {
  public readonly actions: Array<any>;
  private readonly keyManagerService: KeyManagerService;

  constructor(index: number) {
    super();

    const highest = [];
    for (let i = 1; i <= index + 1; i += 1) {
      highest.push(String(i));
    }
    const highestStr = highest.join(',');
    const highestSource = highestStr;
    const highestTarget = highestStr;
    const highestProposal = highestStr;
    const seed = Connection.db().get('seed');

    let network = 'mainnet';
    if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
      network = 'pyrmont';
    }

    this.keyManagerService = new KeyManagerService();

    this.actions = [
      {
        instance: this.keyManagerService,
        method: 'importValidators',
        params: {
          seed,
          index,
          network,
          highestSource,
          highestTarget,
          highestProposal
        }
      }
    ];
  }
}
