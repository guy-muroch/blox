import ProcessClass from './process.class';
import KeyManagerService from '../services/key-manager/key-manager.service';

export default class ValidatorsListProcess extends ProcessClass {
  public readonly actions: Array<any>;
  private readonly keyManagerService: KeyManagerService;

  constructor(index: number) {
    super();
    this.keyManagerService = new KeyManagerService();
    this.actions = [
      {
        instance: this.keyManagerService,
        method: 'getValidatorsList',
        params: {
          index
        }
      }
    ];
  }
}
