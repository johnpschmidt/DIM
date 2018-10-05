import * as React from 'react';
import {
  DropTarget,
  DropTargetSpec,
  DropTargetConnector,
  DropTargetMonitor,
  ConnectDropTarget
} from 'react-dnd';
import * as classNames from 'classnames';
import { DimItem } from '../inventory/item-types';
import { flatMap } from '../util';

interface ExternalProps {
  bucketTypes: string[];
  storeIds: string[];
  children?: React.ReactNode;
  onDroppedItem(item: DimItem);
}

// These are all provided by the DropTarget HOC function
interface InternalProps {
  connectDropTarget: ConnectDropTarget;
  isOver: boolean;
}

type Props = InternalProps & ExternalProps;

// This determines what types can be dropped on this target
function dragType(props: ExternalProps) {
  return flatMap(props.bucketTypes, (bucketType) =>
    flatMap(props.storeIds, (storeId) => [bucketType, `${storeId}-${bucketType}`])
  );
}

// This determines the behavior of dropping on this target
const dropSpec: DropTargetSpec<Props> = {
  drop(props, monitor) {
    const item = monitor.getItem().item as DimItem;
    props.onDroppedItem(item);
  }
};

// This forwards drag and drop state into props on the component
function collect(connect: DropTargetConnector, monitor: DropTargetMonitor): InternalProps {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
}

class LoadoutDrawerDropTarget extends React.Component<Props> {
  render() {
    const { connectDropTarget, children, isOver } = this.props;

    return connectDropTarget(
      <div
        className={classNames('loadout-drop', {
          'on-drag-hover': isOver
        })}
      >
        {children}
      </div>
    );
  }
}

export default DropTarget(dragType, dropSpec, collect)(LoadoutDrawerDropTarget);
