import { EventBus } from '@/tools/utils/event-bus'

export enum ImageEditorEvent {
  HISTORY_CHANGE = 'HISTORY_CHANGE',
  IMAGE_VIEW_BOX_POSITION_CHANGE = 'IMAGE_VIEW_BOX_POSITION_CHANGE',
  IMAGE_ZOOM_CHANGE = 'IMAGE_ZOOM_CHANGE',
  TOOL_CHANGE = 'TOOL_CHANGE',
}

export type ImageEditorEvents = {
  [ImageEditorEvent.HISTORY_CHANGE]: {}
  [ImageEditorEvent.IMAGE_VIEW_BOX_POSITION_CHANGE]: {}
  [ImageEditorEvent.IMAGE_ZOOM_CHANGE]: {}
  [ImageEditorEvent.TOOL_CHANGE]: {}
}

export class EditorEventBus extends EventBus<ImageEditorEvents> {
  constructor() {
    super(ImageEditorEvent)
  }
}
