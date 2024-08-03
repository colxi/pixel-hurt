// https://fontawesome.com/search?q=zoom&o=r

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPaintBrush,
  faArrowsUpDownLeftRight,
  faEraser,
  faHand,
  faMagnifyingGlass
} from '@fortawesome/free-solid-svg-icons'


export const CrossIcon = () => <FontAwesomeIcon icon={faArrowsUpDownLeftRight} />
export const BrushIcon = () => <FontAwesomeIcon icon={faPaintBrush} />
export const EraserIcon = () => <FontAwesomeIcon icon={faEraser} />
export const HandIcon = () => <FontAwesomeIcon icon={faHand} />
export const MagnifyingGlassIcon = () => <FontAwesomeIcon icon={faMagnifyingGlass} />