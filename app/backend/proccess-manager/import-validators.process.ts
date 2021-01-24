import ProcessClass from './process.class';
import Connection from '../common/store-manager/connection';
import KeyManagerService from '../services/key-manager/key-manager.service';

export default class ImportValidatorsProcess extends ProcessClass {
  public readonly actions: Array<any>;
  private readonly keyManagerService: KeyManagerService;

  constructor(index: number) {
    super();

    const highest = [];
    for (let i = 0; i <= index; i += 1) {
      highest.push(String(i));
    }
    const highestStr = highest.join(',');
    const highestSource = highestStr;
    const highestTarget = highestStr;
    const highestProposal = highestStr;

    // TODO: what is the prefix for db?
    const seed = Connection.db().get('seed');
    const network = Connection.db().get('network') || 'pyrmont'; // Not working
    console.debug({ seed, network });

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
