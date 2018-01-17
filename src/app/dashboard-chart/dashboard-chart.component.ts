import {Component, Input} from '@angular/core';
import {DataDefinition} from '../data-definition';
import {NgxChartItem, NgxChartResult} from './ngx-definitions';

@Component({
  selector: 'app-dashboard-chart',
  templateUrl: './dashboard-chart.component.html',
  styleUrls: ['./dashboard-chart.component.css']
})
export class DashboardChartComponent {
  commitMap = new WeakMap<any, string>();
  messageMap = new WeakMap<any, string>();
  diffMap = [];
  files = ['inline', 'polyfills', 'main'];
  payloads: DataDefinition[];
  _showGzip7: boolean = false;
  _showGzip9: boolean = false;

  @Input()
  set showGzip7(value: boolean) {
    this._showGzip7 = value;
    this.chartData = this.createChartResults(this.payloads);
  }

  @Input()
  set showGzip9(value: boolean) {
    this._showGzip9 = value;
    this.chartData = this.createChartResults(this.payloads);
  }

  constructor() {
    this.diffMap['Gzip 7'] = new WeakMap<any, number>();
    this.diffMap['Gzip 9'] = new WeakMap<any, number>();
    this.diffMap['Uncompressed'] = new WeakMap<any, number>();
  }

  /** Color scheme for the payload graph. */
  colorScheme = {
    domain: ['#a8385d', '#50abcc', '#8796c0', '#AAAAAA']
  };

  /** X-Axis label of the Chart. */
  xAxisLabel = 'Date';

  /** Y-Axis label of the Chart. */
  get yAxisLabel() {
    return `Payload Size (${this._file})`;
  }

  _file: string = 'inline';

  /** Chart data that is taken by NGX-Charts. */
  chartData: NgxChartResult[];

  @Input()
  set file(value: string) {
    this._file = value;
    this.chartData = this.createChartResults(this.payloads);
  }

  /** Payload data that will be rendered in the chart. */
  @Input()
  set data(value: DataDefinition[]) {
    this.payloads = value;
    this.chartData = this.createChartResults(value);
  }

  /** Creates a list of ngx-chart results of the Payload results. */
  private createChartResults(data: DataDefinition[]) {
    if (!data) {
      return [];
    }

    // Data snapshot from Firebase is not ordered by timestamp. Before rendering the graph
    // manually sort the results by their timestamp.
    data = data.sort((a, b) => a.timestamp < b.timestamp ? -1 : 1);

    const gzip7ChartItems: NgxChartItem[] = [];
    const gzip9ChartItems: NgxChartItem[] = [];
    const uncompressedChartItems: NgxChartItem[] = [];

    // Walk through every result entry and create a NgxChart item that can be rendered inside of
    // the linear chart.
    data.forEach(result => {
      if (!result.gzip7 || !result.gzip9 || !result.uncompressed) {
        return;
      }

      // Convert the timestamp of the payload result into a date because NGX-Charts can group
      // dates in the x-axis.
      const date = new Date(result.timestamp * 1000);

      let gzip7Size = 0, gzip9Size = 0, uncompressedSize = 0;
      let gzip7Diff = 0, gzip9Diff = 0, uncompressedDiff = 0;

      let index = data.indexOf(result);
      if (index > 0) {
        let previous = data[index - 1];
        if (this._file === 'sum') {
          this.files.forEach((file) => {
            gzip7Diff += result.gzip7[file] - previous.gzip7[file];
            gzip9Diff += result.gzip9[file] - previous.gzip9[file];
            uncompressedDiff += result.uncompressed[file] - previous.uncompressed[file];
          });
        } else {
          gzip7Diff = result.gzip7[this._file] - previous.gzip7[this._file];
          gzip9Diff = result.gzip9[this._file] - previous.gzip9[this._file];
          uncompressedDiff = result.uncompressed[this._file] - previous.uncompressed[this._file];
        }
      }

      if (this._file === 'sum') {
        this.files.forEach((file) => {
          gzip7Size += result.gzip7[file];
          gzip9Size += result.gzip9[file];
          uncompressedSize += result.uncompressed[file];
        });
      } else {
        gzip7Size += result.gzip7[this._file];
        gzip9Size += result.gzip9[this._file];
        uncompressedSize += result.uncompressed[this._file];
      }

      this.diffMap['Gzip 7'].set(date, gzip7Diff);
      this.diffMap['Gzip 9'].set(date, gzip9Diff);
      this.diffMap['Uncompressed'].set(date, uncompressedDiff);
      let gzip7Value = { name: date, value: gzip7Size, diff: gzip7Diff};
      let gzip9Value = { name: date, value: gzip9Size, diff: gzip9Diff};
      let uncompressedValue = { name: date, value: uncompressedSize, diff: uncompressedDiff};

      this.commitMap.set(date, result.$key);
      this.messageMap.set(date, result.message);

      gzip7ChartItems.push(gzip7Value);
      gzip9ChartItems.push(gzip9Value);
      uncompressedChartItems.push(uncompressedValue);
    });

    let result = [
      { name: 'Uncompressed', series: uncompressedChartItems }
    ];

    if (this._showGzip7) {
      result.push({ name: 'Gzip 7', series: gzip7ChartItems });
    }
    if (this._showGzip9) {
      result.push({ name: 'Gzip 9', series: gzip9ChartItems });
    }

    return result;
  }

  onSelect(event: NgxChartItem) {
    let commit = this.commitMap.get(event.name);
    if (!!commit) {
      window.open(`https://github.com/angular/angular/commit/${commit}`, '_blank');
    }
    console.log(event);

  }
}
