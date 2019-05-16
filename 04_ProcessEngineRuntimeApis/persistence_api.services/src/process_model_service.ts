import * as clone from 'clone';
import {Logger} from 'loggerhythm';

import {ForbiddenError, NotFoundError, UnprocessableEntityError} from '@essential-projects/errors_ts';
import {IIAMService, IIdentity} from '@essential-projects/iam_contracts';

import {Repositories, Services, Types} from '@process-engine/persistence_api.contracts';

const logger: Logger = Logger.createLogger('processengine:persistence:process_model_service');

export class ProcessDefinitionService implements Services.IProcessDefinitionService {

  private readonly processDefinitionRepository: Repositories.IProcessDefinitionRepository;
  private readonly iamService: IIAMService;
  private readonly bpmnModelParser: Types.IModelParser = undefined;

  private canReadProcessModelClaim = 'can_read_process_model';
  private canWriteProcessModelClaim = 'can_write_process_model';

  constructor(
    bpmnModelParser: Types.IModelParser,
    iamService: IIAMService,
    processDefinitionRepository: Repositories.IProcessDefinitionRepository,
  ) {

    this.processDefinitionRepository = processDefinitionRepository;
    this.iamService = iamService;
    this.bpmnModelParser = bpmnModelParser;
  }

  public async persistProcessDefinitions(
    identity: IIdentity,
    name: string,
    xml: string,
    overwriteExisting: boolean = true,
  ): Promise<void> {

    await this.iamService.ensureHasClaim(identity, this.canWriteProcessModelClaim);
    await this.validateDefinition(name, xml);

    return this.processDefinitionRepository.persistProcessDefinitions(name, xml, overwriteExisting);
  }

  public async getProcessModels(identity: IIdentity): Promise<Array<Types.ProcessModel.Process>> {

    await this.iamService.ensureHasClaim(identity, this.canReadProcessModelClaim);

    const processModelList = await this.getProcessModelList();

    const filteredList: Array<Types.ProcessModel.Process> = [];

    for (const processModel of processModelList) {
      const filteredProcessModel = await this.filterInaccessibleProcessModelElements(identity, processModel);

      if (filteredProcessModel) {
        filteredList.push(filteredProcessModel);
      }
    }

    return filteredList;
  }

  public async getProcessModelById(identity: IIdentity, processModelId: string): Promise<Types.ProcessModel.Process> {

    await this.iamService.ensureHasClaim(identity, this.canReadProcessModelClaim);

    const processModel = await this.retrieveProcessModel(processModelId);

    const filteredProcessModel = await this.filterInaccessibleProcessModelElements(identity, processModel);

    if (!filteredProcessModel) {
      throw new ForbiddenError('Access denied.');
    }

    return filteredProcessModel;
  }

  public async getByHash(identity: IIdentity, processModelId: string, hash: string): Promise<Types.ProcessModel.Process> {

    await this.iamService.ensureHasClaim(identity, this.canReadProcessModelClaim);

    const definitionRaw = await this.processDefinitionRepository.getByHash(hash);

    const parsedDefinition = await this.bpmnModelParser.parseXmlToObjectModel(definitionRaw.xml);
    const processModel = parsedDefinition.processes.find((entry: Types.ProcessModel.Process): boolean => {
      return entry.id === processModelId;
    });

    const filteredProcessModel = await this.filterInaccessibleProcessModelElements(identity, processModel);

    if (!filteredProcessModel) {
      throw new ForbiddenError('Access denied.');
    }

    return filteredProcessModel;
  }

  public async getProcessDefinitionAsXmlByName(identity: IIdentity, name: string): Promise<Types.ProcessDefinitionFromRepository> {

    await this.iamService.ensureHasClaim(identity, this.canReadProcessModelClaim);

    const definitionRaw = await this.processDefinitionRepository.getProcessDefinitionByName(name);

    if (!definitionRaw) {
      throw new NotFoundError(`Process definition with name "${name}" not found!`);
    }

    return definitionRaw;
  }

  public async deleteProcessDefinitionById(processModelId: string): Promise<void> {
    this.processDefinitionRepository.deleteProcessDefinitionById(processModelId);
  }

  /**
   * Takes the xml code of a given ProcessDefinition and tries to parse it.
   * If the parsing is successful, the xml is assumed to be valid.
   * Otherwise an error is thrown.
   *
   * @param name The name of the ProcessDefinition to validate.
   * @param xml  The xml code of the ProcessDefinition to validate.
   */
  private async validateDefinition(name: string, xml: string): Promise<void> {

    let parsedProcessDefinition: Types.ProcessModel.Definitions;

    try {
      parsedProcessDefinition = await this.bpmnModelParser.parseXmlToObjectModel(xml);
    } catch (error) {
      logger.error(`The XML for process "${name}" could not be parsed: ${error.message}`);
      const parsingError = new UnprocessableEntityError(`The XML for process "${name}" could not be parsed.`);

      parsingError.additionalInformation = error;

      throw parsingError;
    }

    const processDefinitionHasMoreThanOneProcessModel = parsedProcessDefinition.processes.length > 1;
    if (processDefinitionHasMoreThanOneProcessModel) {
      const tooManyProcessModelsError = `The XML for process "${name}" contains more than one ProcessModel. This is currently not supported.`;
      logger.error(tooManyProcessModelsError);

      throw new UnprocessableEntityError(tooManyProcessModelsError);
    }

    const processsModel = parsedProcessDefinition.processes[0];

    const processModelIdIsNotEqualToDefinitionName = processsModel.id !== name;
    if (processModelIdIsNotEqualToDefinitionName) {
      const namesDoNotMatchError = `The ProcessModel contained within the diagram "${name}" must also use the name "${name}"!`;
      logger.error(namesDoNotMatchError);

      throw new UnprocessableEntityError(namesDoNotMatchError);
    }
  }

  private async retrieveProcessModel(processModelId: string): Promise<Types.ProcessModel.Process> {

    const processModelList = await this.getProcessModelList();

    const matchingProcessModel = processModelList.find((processModel: Types.ProcessModel.Process): boolean => {
      return processModel.id === processModelId;
    });

    if (!matchingProcessModel) {
      throw new NotFoundError(`ProcessModel with id ${processModelId} not found!`);
    }

    return matchingProcessModel;
  }

  private async getProcessModelList(): Promise<Array<Types.ProcessModel.Process>> {

    const definitions = await this.getProcessDefinitionList();

    const allProcessModels: Array<Types.ProcessModel.Process> = [];

    for (const definition of definitions) {
      Array.prototype.push.apply(allProcessModels, definition.processes);
    }

    return allProcessModels;
  }

  private async getProcessDefinitionList(): Promise<Array<Types.ProcessModel.Definitions>> {

    const definitionsRaw = await this.processDefinitionRepository.getProcessDefinitions();

    const definitionsMapper =
      async (rawProcessModelData: Types.ProcessDefinitionFromRepository): Promise<Types.ProcessModel.Definitions> => {
        return this.bpmnModelParser.parseXmlToObjectModel(rawProcessModelData.xml);
      };

    const definitionsList =
      await Promise.map<Types.ProcessDefinitionFromRepository, Types.ProcessModel.Definitions>(definitionsRaw, definitionsMapper);

    return definitionsList;
  }

  private async filterInaccessibleProcessModelElements(
    identity: IIdentity,
    processModel: Types.ProcessModel.Process,
  ): Promise<Types.ProcessModel.Process> {

    const processModelCopy = clone(processModel);

    const processModelHasNoLanes = !(processModel.laneSet && processModel.laneSet.lanes && processModel.laneSet.lanes.length > 0);
    if (processModelHasNoLanes) {
      return processModelCopy;
    }

    processModelCopy.laneSet = await this.filterOutInaccessibleLanes(processModelCopy.laneSet, identity);
    processModelCopy.flowNodes = this.getFlowNodesForLaneSet(processModelCopy.laneSet, processModel.flowNodes);

    const processModelHasAccessibleStartEvent = this.checkIfProcessModelHasAccessibleStartEvents(processModelCopy);
    if (!processModelHasAccessibleStartEvent) {
      return undefined;
    }

    return processModelCopy;
  }

  private async filterOutInaccessibleLanes(
    laneSet: Types.ProcessModel.ProcessElements.LaneSet,
    identity: IIdentity,
  ): Promise<Types.ProcessModel.ProcessElements.LaneSet> {

    const filteredLaneSet = clone(laneSet);
    filteredLaneSet.lanes = [];

    for (const lane of laneSet.lanes) {

      const userCanNotAccessLane = !await this.checkIfUserCanAccesslane(identity, lane.name);
      const filteredLane = clone(lane);

      if (userCanNotAccessLane) {
        filteredLane.flowNodeReferences = [];
        delete filteredLane.childLaneSet;
      }

      const laneHasChildLanes = !filteredLane.childLaneSet;
      if (laneHasChildLanes) {
        filteredLane.childLaneSet = await this.filterOutInaccessibleLanes(filteredLane.childLaneSet, identity);
      }

      filteredLaneSet.lanes.push(filteredLane);
    }

    return filteredLaneSet;
  }

  private async checkIfUserCanAccesslane(identity: IIdentity, laneName: string): Promise<boolean> {
    try {
      await this.iamService.ensureHasClaim(identity, laneName);

      return true;
    } catch (error) {
      return false;
    }
  }

  private getFlowNodesForLaneSet(
    laneSet: Types.ProcessModel.ProcessElements.LaneSet,
    flowNodes: Array<Types.ProcessModel.Base.FlowNode>,
  ): Array<Types.ProcessModel.Base.FlowNode> {

    const accessibleFlowNodes: Array<Types.ProcessModel.Base.FlowNode> = [];

    for (const lane of laneSet.lanes) {

      // NOTE: flowNodeReferences are stored in both, the parent lane AND in the child lane!
      // So if we have a lane A with two Sublanes B and C, we must not evaluate the elements from lane A!
      // Consider a user who can only access sublane B.
      // If we were to allow him access to all references stored in lane A, he would also be granted access to the elements
      // from lane C, since they are contained within the reference set of lane A!
      const childLaneSetIsNotEmpty = lane.childLaneSet !== undefined &&
                                      lane.childLaneSet.lanes !== undefined &&
                                      lane.childLaneSet.lanes.length > 0;

      if (childLaneSetIsNotEmpty) {
        const accessibleChildLaneFlowNodes = this.getFlowNodesForLaneSet(lane.childLaneSet, flowNodes);

        accessibleFlowNodes.push(...accessibleChildLaneFlowNodes);
      } else {
        for (const flowNodeId of lane.flowNodeReferences) {
          const matchingFlowNode = flowNodes.find((flowNode: Types.ProcessModel.Base.FlowNode): boolean => {
            return flowNode.id === flowNodeId;
          });

          if (matchingFlowNode) {
            accessibleFlowNodes.push(matchingFlowNode);
          }
        }
      }
    }

    return accessibleFlowNodes;
  }

  private checkIfProcessModelHasAccessibleStartEvents(processModel: Types.ProcessModel.Process): boolean {

    // For this check to pass, it is sufficient for the ProcessModel to have at least one accessible start event.
    const processModelHasAccessibleStartEvent = processModel.flowNodes.some((flowNode: Types.ProcessModel.Base.FlowNode): boolean => {
      return flowNode.bpmnType === Types.BpmnType.startEvent;
    });

    return processModelHasAccessibleStartEvent;
  }

}
