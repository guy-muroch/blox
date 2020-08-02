import Configstore from 'configstore';
import ServerService from '../key-vault/server.service';
import { step } from '../decorators';

export default class AccountService {
  public readonly conf: Configstore;
  public readonly serverService: ServerService;

  constructor(storeName: string) {
    this.conf = new Configstore(storeName);
    this.serverService = new ServerService(storeName);
  }

  @step({
    name: 'Sync vault with blox api',
    requiredConfig: ['publicIp', 'authToken'],
  })
  async syncVaultWithBlox(): Promise<void> {
    const ssh = await this.serverService.getConnection();
    const { stdout: rootToken } = await ssh.execCommand('sudo cat data/keys/vault.root.token', {});
    if (!rootToken) throw new Error('root vault-plugin key not found');
    this.conf.set('vaultRootToken', rootToken);
    const { stdout: statusCode, stderr } = await ssh.execCommand(
      `curl -s -o /dev/null -w "%{http_code}" --header "Content-Type: application/json" --header "Authorization: Bearer ${this.conf.get('authToken')}" --request POST --data '{"url": "http://${this.conf.get('publicIp')}:8200", "accessToken": "${rootToken}"}' https://api.stage.bloxstaking.com/wallets/sync`,
      {},
    );
    if (+statusCode > 201) {
      throw new Error(`Blox Staking api error: ${statusCode} ${stderr}`);
    }
  }

  @step({
    name: 'Resync vault with blox api',
    requiredConfig: ['publicIp', 'authToken'],
  })
  async resyncNewVaultWithBlox(): Promise<void> {
    const ssh = await this.serverService.getConnection();
    const { stdout: rootToken } = await ssh.execCommand('sudo cat data/keys/vault.root.token', {});
    if (!rootToken) throw new Error('root vault-plugin key not found');
    this.conf.set('vaultRootToken', rootToken);
    const { stdout: statusCode, stderr } = await ssh.execCommand(
      `curl -s -o /dev/null -w "%{http_code}" --header "Content-Type: application/json" --header "Authorization: Bearer ${this.conf.get('authToken')}" --request PATCH --data '{"url": "http://${this.conf.get('publicIp')}:8200", "accessToken": "${rootToken}"}' https://api.stage.bloxstaking.com/wallets/sync`,
      {},
    );
    if (+statusCode > 201) {
      throw new Error(`Blox Staking api error: ${statusCode} ${stderr}`);
    }
  }

  @step({
    name: 'Remove blox staking account',
    requiredConfig: ['authToken'],
  })
  async deleteBloxAccount(): Promise<void> {
    const ssh = await this.serverService.getConnection();
    const { stdout: statusCode, stderr } = await ssh.execCommand(
      `curl -s -o /dev/null -w "%{http_code}" --header "Content-Type: application/json" --header "Authorization: Bearer ${this.conf.get('authToken')}" --request DELETE https://api.stage.bloxstaking.com/organizations}`,
      {},
    );
    if (+statusCode > 201) {
      console.log(`Blox Staking api error: ${statusCode} ${stderr}`);
    }
  }
}
