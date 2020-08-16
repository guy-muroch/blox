import AwsService from '../aws/aws.service';
import AccountService from '../account/account.service';
import ProcessClass from './process.class';

export default class UninstallProcess extends ProcessClass {
  private readonly awsService: AwsService;
  private readonly accountService: AccountService;
  public readonly actions: Array<any>;

  constructor() {
    super();
    this.awsService = new AwsService();
    this.accountService = new AccountService();
    this.actions = [
      { instance: this.accountService, method: 'deleteBloxAccount' },
      { instance: this.awsService, method: 'uninstallItems' }
    ];
  }
}
