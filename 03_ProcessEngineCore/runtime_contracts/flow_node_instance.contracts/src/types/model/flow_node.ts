import {BpmnType} from '../../constants';
import {ExtensionElements} from './extension_elements';

/**
 * Base class for all FlowNodes.
 */
// tslint:disable:max-classes-per-file
export abstract class FlowNode {

  public id: string;
  public documentation?: Array<string>;
  public extensionElements?: ExtensionElements;
  public bpmnType: BpmnType;
  public name: string;
  public incoming: Array<string> = [];
  public outgoing: Array<string> = [];
  public defaultOutgoingSequenceFlowId?: string;

}
