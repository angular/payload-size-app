import {Component, Input, OnInit} from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import {DataDefinition} from '../data-definition';
import {ActivatedRoute, ParamMap} from '@angular/router';

@Component({
  selector: 'app-dashboard-app',
  templateUrl: './dashboard-app.component.html',
  styleUrls: ['./dashboard-app.component.css']
})
export class DashboardAppComponent implements OnInit {
  /** Payload results from Firebase. */
  payloads: DataDefinition[];

  /** Whether we display gzip data */
  showGzip7: boolean = false;
  showGzip9: boolean = false;

  /** File names */
  files: string[];

  @Input() project: string = 'aio';

  @Input() branch: string = 'master';

  constructor(private database: AngularFireDatabase, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap
      .subscribe((params: ParamMap) => {
          this.project = params.get('project');
          this.branch = params.get('branch');
          // this.payloads = this.database.list(`payload/${this.project}/${this.branch}`);

        this.database.list(`payload/${this.project}/${this.branch}`,
              ref =>  ref.orderByChild('timestamp')).snapshotChanges().map(projects => {
            return projects.map(project => ({ key: project.key, ...project.payload.val() }));
          }).subscribe(items => {
            this.payloads = items;
            this.files = [];
            const dataSample = items[items.length - 1].uncompressed;
            for (let data in dataSample) {
              this.files.push(data);
            }
          });
      });
  }
}
