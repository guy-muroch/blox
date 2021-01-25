import { Subject } from '../../../../../../backend/proccess-manager/subject.interface';
import { Observer } from '../../../../../../backend/proccess-manager/observer.interface';

/**
 * Listen for validators
 */
export class GeneratedValidatorsListener implements Observer {
  private readonly setGeneratedValidators: any;
  private validators: any[];

  constructor(setGeneratedValidators: any) {
    this.setGeneratedValidators = setGeneratedValidators;
  }

  public update(_subject: Subject, payload: any) {
    if (payload.validators) {
      this.validators = payload.validators;
    }

    switch (payload.state) {
      case 'completed':
        this.validators && this.setGeneratedValidators(this.validators);
        break;
    }
  }
}
