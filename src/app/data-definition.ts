import {AioDataDefinition} from './aio-data-definition';

export interface DataDefinition {
  change: 'application' | 'dependencies' | 'application + dependencies';
  timestamp: number;
  gzip7: AioDataDefinition;
  gzip9: AioDataDefinition;
  uncompressed: AioDataDefinition;
  message: string | null;
  $key: string | null;
}
