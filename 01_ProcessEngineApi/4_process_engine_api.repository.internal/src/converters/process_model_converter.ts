import {DataModels} from '@process-engine/process_engine_api.contracts';
import {IProcessModelFacade, IProcessModelFacadeFactory} from '@process-engine/process_engine_contracts';
import {Model} from '@process-engine/process_model.contracts';

export class ProcessModelConverter {

  private processModelFacadeFactory: IProcessModelFacadeFactory;

  constructor(processModelFacadeFactory: IProcessModelFacadeFactory) {
    this.processModelFacadeFactory = processModelFacadeFactory;
  }

  public convertProcessModel(processModel: Model.Process): DataModels.ProcessModels.ProcessModel {

    const processModelFacade: IProcessModelFacade = this.processModelFacadeFactory.create(processModel);

    function eventConverter(event: Model.Events.Event): DataModels.Events.Event {
      const publicEvent: DataModels.Events.Event = new DataModels.Events.Event();
      publicEvent.id = event.id;

      return publicEvent;
    }

    let sanitizedStartEvents: Array<DataModels.Events.Event> = [];
    let sanitizedEndEvents: Array<DataModels.Events.Event> = [];

    const processModelIsExecutable: boolean = processModelFacade.getIsExecutable();

    if (processModelIsExecutable) {
      const startEvents: Array<Model.Events.StartEvent> = processModelFacade.getStartEvents();
      sanitizedStartEvents = startEvents.map(eventConverter);

      const endEvents: Array<Model.Events.EndEvent> = processModelFacade.getEndEvents();
      sanitizedEndEvents = endEvents.map(eventConverter);
    }

    const processModelResponse: DataModels.ProcessModels.ProcessModel = {
      id: processModel.id,
      startEvents: sanitizedStartEvents,
      endEvents: sanitizedEndEvents,
    };

    return processModelResponse;
  }

}
