import { EventBus } from '@/tools/utils/event-bus'

export enum ImageEditorEvent {
  HISTORY_CHANGE = 'HISTORY_CHANGE',
  IMAGE_VIEW_BOX_POSITION_CHANGE = 'IMAGE_VIEW_BOX_POSITION_CHANGE',
  IMAGE_ZOOM_CHANGE = 'IMAGE_ZOOM_CHANGE',
  TOOL_CHANGE = 'TOOL_CHANGE',
  COLOR_PALETTE_CHANGE = 'COLOR_PALETTE_CHANGE',
  PRIMARY_COLOR_CHANGE = 'PRIMARY_COLOR_CHANGE',
  SECONDARY_COLOR_CHANGE = 'SECONDARY_COLOR_CHANGE',
}

export type ImageEditorEvents = {
  [ImageEditorEvent.HISTORY_CHANGE]: {}
  [ImageEditorEvent.IMAGE_VIEW_BOX_POSITION_CHANGE]: {}
  [ImageEditorEvent.IMAGE_ZOOM_CHANGE]: {}
  [ImageEditorEvent.TOOL_CHANGE]: {}
  [ImageEditorEvent.COLOR_PALETTE_CHANGE]: {}
  [ImageEditorEvent.PRIMARY_COLOR_CHANGE]: {}
  [ImageEditorEvent.SECONDARY_COLOR_CHANGE]: {}
}

export class EditorEventBus extends EventBus<ImageEditorEvents> {
  constructor() {
    super(ImageEditorEvent)
  }
}
