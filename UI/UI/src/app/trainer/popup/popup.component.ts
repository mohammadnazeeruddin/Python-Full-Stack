import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { material_data } from './../../shared/material';
import { ArrayDataSource } from '@angular/cdk/collections';
import { NestedTreeControl } from '@angular/cdk/tree';
@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {
  material_data = material_data
  tree_data = []
  treeControl: any;
  tree_dataSource: any;
  hasChild: any;

  constructor(public dialogRef: MatDialogRef<PopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.onDone(data['topic'])
  }

  ngOnInit() {
  }

  onDone(topic): void {
    let data = {}
    let index: any;
    for (let m in this.material_data) {
      if (this.material_data[m]['material_name'] == topic) {
        index = m;
        // this.material_data[m]['checked'] = true;
        // this.material_data[m]['disabled'] = false;
        let children = []
        for (let chapter of this.material_data[m]['chapter_data']) {
          let page_data = []
          // c['checked'] = true
          // c['disabled'] = false
          for (let pages of chapter['page_data']) {
            let page_child = {}
            page_child['name'] = pages['page_name']
            page_child['checked'] = true
            page_child['disabled'] = false
            page_data.push(page_child)
          }
          children.push({ 'name': chapter['chapter_name'], 'checked': true, 'disabled': false, 'children': page_data })
        }
        this.tree_data.push({ 'name': this.material_data[m]['material_name'], 'checked': true, 'disabled': false, 'children': children })
      } else {
        if (index !=undefined && index == m) {
          continue
        }
        else {
          let children = []
          for (let chapter of this.material_data[m]['chapter_data']) {
            let page_data = []
            // c['checked'] = true
            // c['disabled'] = false
            for (let pages of chapter['page_data']) {
              let page_child = {}
              page_child['name'] = pages['page_name']
              page_child['checked'] = false
              page_child['disabled'] = true
              page_data.push(page_child)
            }
            children.push({ 'name': chapter['chapter_name'], 'checked': false, 'disabled': true, 'children': page_data })
          }
          this.tree_data.push({ 'name': this.material_data[m]['material_name'], 'checked': false, 'disabled': true, 'children': children })
        }
      }
    }
    console.log(this.tree_data)
    this.treeControl = new NestedTreeControl<any>(node => node.children);
    this.tree_dataSource = new ArrayDataSource(this.tree_data);
    this.hasChild = (_: number, node: any) => !!node.children && node.children.length > 0

  }
}
