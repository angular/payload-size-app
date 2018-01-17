import {Component} from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  projectNames: string[];

  branchNames: string[] = [];

  _branch = 'master';

  _project = 'aio';

  get project() {
    return this._project || 'aio';
  }

  get branch() {
     return this._branch || 'master';
  }

  constructor(private route:  ActivatedRoute, private database: AngularFireDatabase) {
  }

  ngOnInit() {

    this._project = this.route.snapshot.paramMap.get('project');
    this._branch = this.route.snapshot.paramMap.get('branch');
    this.database.list('payload').snapshotChanges().map(projects => {
      return projects.map(project => ({ key: project.key, ...project.payload.val() }));
    }).subscribe(items => {
      this.projectNames = items.map(item => item.key);
      const datasample = items[0];
      this.branchNames = [];
      for (let data in datasample) {
        if (data !== 'key') {
          this.branchNames.push(data);
        }
      }
      return this.projectNames;
    });
  }
}
