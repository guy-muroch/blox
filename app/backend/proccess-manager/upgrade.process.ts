import AwsService from '../services/aws/aws.service';
import ProcessClass from './process.class';
import KeyVaultService from '../services/key-vault/key-vault.service';
import analytics from '../analytics';

export default class UpgradeProcess extends ProcessClass {
  private readonly awsService: AwsService;
  private readonly keyVaultService: KeyVaultService;
  public readonly actions: Array<any>;

  constructor() {
    super('Upgrade');
    this.awsService = new AwsService();
    this.keyVaultService = new KeyVaultService();
    this.actions = [
      { instance: this.awsService, method: 'setAWSCredentials' },
      { instance: this.keyVaultService, method: 'upgradePlugin' },
      { instance: this.keyVaultService, method: 'getKeyVaultStatus' },
      { instance: this.awsService, method: 'updatePluginTag' },
      {
        hook: async () => {
          await analytics.track('kv-upgraded');
        }
      }
    ];
  }
}
