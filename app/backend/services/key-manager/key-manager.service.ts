import util from 'util';
import { exec } from 'child_process';
import config from '../../common/config';
import { execPath } from '../../../binaries';
import {Catch, CatchClass, Step} from '../../decorators';
import Connection from '../../common/store-manager/connection';

@CatchClass<KeyManagerService>()
export default class KeyManagerService {
  private readonly executablePath: string;
  private readonly executor: (command: string) => Promise<any>;

  constructor() {
    this.executor = util.promisify(exec);
    this.executablePath = execPath;
  }

  async createWallet(network: string): Promise<string> {
    const { stdout, stderr } = await this.executor(`${this.executablePath} wallet create --network=${network}`);
    if (stderr) {
      throw new Error(`Cli error: ${stderr}`);
    }
    return stdout.replace('\n', '');
  }

  @Catch({
    displayMessage: 'Create Keyvault account failed'
  })
  async createAccount(seed: string, index: number, network: string, highestSource: string, highestTarget: string, highestProposal: string): Promise<string> {
    try {
      const { stdout } = await this.executor(
        `${this.executablePath} wallet account create --seed=${seed} --index=${index} --network=${network} --accumulate=true --highest-source=${highestSource} --highest-target=${highestTarget} --highest-proposal=${highestProposal}`
      );
      return stdout.replace('\n', '');
    } catch (e) {
      throw new Error(`Create account with index ${JSON.stringify(index)} was failed`);
    }
  }

  @Catch({
    displayMessage: 'Getting validators list failed'
  })
  @Step({
    name: 'Getting validators list..'
  })
  async getValidatorsList({ index, network }: { index: number, network?: string }): Promise<{ validators: any[], error: string }> {
    try {
      const highest = [];
      for (let i = 1; i <= index; i += 1) {
        highest.push(String(i));
      }
      const highestStr = highest.join(',');
      const highestSource = highestStr;
      const highestTarget = highestStr;
      const highestProposal = highestStr;
      const seed = Connection.db().get('seed');
      const theIndex = index - 1;

      let theNetwork = network || config.env.MAINNET_NETWORK;
      if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
        theNetwork = config.env.PYRMONT_NETWORK;
      }

      const getValidatorsObjectCommand = `${this.executablePath} wallet account create \
        --seed=${seed} \
        --index=${theIndex} \
        --network=${theNetwork} \
        --highest-source=${highestSource} \
        --highest-target=${highestTarget} \
        --highest-proposal=${highestProposal} \
        --response-type=object \
        --accumulate=true`;

      const { stdout } = await this.executor(getValidatorsObjectCommand);

      let validators = JSON.parse(stdout);
      if (validators && validators.length) {
        validators = validators.reverse();
      }

      return {
        validators,
        error: ''
      };
    } catch (e) {
      console.error('Import validators error', e);
      return {
        validators: [],
        error: e.message || e.stack || e
      };
    }
  }

  async getAccount(seed: string, index: number, network: string, accumulate: boolean = false): Promise<any> {
    let highestSource = '';
    let highestTarget = '';
    let highestProposal = '';

    if (!accumulate) {
      highestSource = '0';
      highestTarget = '1';
      highestProposal = '0';
    } else {
      for (let i = 0; i <= index; i += 1) {
        highestSource += `${i.toString()}${i === index ? '' : ','}`;
        highestTarget += `${(i + 1).toString()}${i === index ? '' : ','}`;
      }
      highestProposal = highestSource;
    }

    try {
      const { stdout } = await this.executor(
        `${this.executablePath} wallet account create --seed=${seed} --index=${index} --network=${network} --response-type=object --accumulate=${accumulate} --highest-source=${highestSource} --highest-target=${highestTarget} --highest-proposal=${highestProposal}`
      );
      return stdout ? JSON.parse(stdout) : {};
    } catch (e) {
      throw new Error(`Get keyvault account with index ${JSON.stringify(index)} was failed.`);
    }
  }

  async getDepositData(seed: string, index: number, publicKey: string, network: string): Promise<any> {
    try {
      console.log('---getdep cmd', `${this.executablePath} wallet account deposit-data --seed=${seed} --index=${index} --public-key=${publicKey} --network=${network}`);
      const { stdout } = await this.executor(
        `${this.executablePath} wallet account deposit-data --seed=${seed} --index=${index} --public-key=${publicKey} --network=${network}`
      );
      console.log('---getdep stdout', stdout);
      return stdout ? JSON.parse(stdout) : {};
    } catch (e) {
      throw new Error(`Get ${network} deposit account data with index ${JSON.stringify(index)} was failed.`);
    }
  }

  async mnemonicGenerate(): Promise<string> {
    try {
      const { stdout } = await this.executor(`${this.executablePath} mnemonic generate`);
      console.log(stdout);
      return stdout.replace('\n', '');
    } catch (e) {
      throw new Error('Generate mnemonic failed.');
    }
  }

  @Catch({
    showErrorMessage: true
  })
  async seedFromMnemonicGenerate(mnemonic: string): Promise<string> {
    const defaultMnemonicLengthPhrase = 24;
    if (!mnemonic || mnemonic.length === 0) {
      throw new Error('Mnemonic phrase is empty');
    }
    if (mnemonic.split(' ').length !== defaultMnemonicLengthPhrase) {
      throw new Error('Mnemonic phrase should have 24-word length');
    }
    try {
      const { stdout } = await this.executor(`${this.executablePath} seed generate --mnemonic="${mnemonic}"`);
      return stdout.replace('\n', '');
    } catch (e) {
      throw new Error('Passphrase not correct');
    }
  }

  @Catch({
    showErrorMessage: true
  })
  async getAttestation(network: string): Promise<any> {
    try {
      const { stdout: epochData } = await this.executor(`${this.executablePath} config current-epoch --network ${network}`);
      const epoch = epochData.replace('\n', '');
      const { stdout: slotData } = await this.executor(`${this.executablePath} config current-slot --network ${network}`);
      const slot = slotData.replace('\n', '');
      return {
        epoch: +epoch,
        slot: +slot
      };
    } catch (e) {
      throw new Error('Passphrase not correct');
    }
  }
}
