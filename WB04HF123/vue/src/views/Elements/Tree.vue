<template>
    <ContentWrapper>
        <div class="content-heading">
            <div>Vue Tree
                <small>A Tree Plugin For Vue2</small>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6">
                <div class="form-group mb-4">
                    <input type="text" class="form-control" placeholder="Search text..."
                    @keyup="inputKeyUp" v-model="searchText" />
                </div>
                <v-jstree
                    :data="data"
                    show-checkbox
                    multiple
                    allow-batch
                    whole-row
                    draggable
                    @item-click="itemClick"
                    @item-drop-before="itemDropBefore"
                    @item-drop="itemDrop"
                    ref="tree">
                </v-jstree>
                <b-btn class="mt-4" variant="danger" id="drag-me" draggable="true">drag me to add new child !</b-btn>
            </div>
        </div>
    </ContentWrapper>
</template>
<script>
    import VJstree from 'vue-jstree'

    export default {
        components: {
            VJstree
        },
        data() {
            return {
                data: [
                  {
                    "text": "Same but with checkboxes",
                    "children": [
                      {
                        "text": "initially selected",
                        "selected": true
                      },
                      {
                        "text": "custom icon",
                        "icon": "fa fa-warning icon-state-danger"
                      },
                      {
                        "text": "initially open",
                        "icon": "fa fa-folder icon-state-default",
                        "opened": true,
                        "children": [
                          {
                            "text": "Another node"
                          }
                        ]
                      },
                      {
                        "text": "custom icon",
                        "icon": "fa fa-warning icon-state-warning"
                      },
                      {
                        "text": "disabled node",
                        "icon": "fa fa-check icon-state-success",
                        "disabled": true
                      }
                    ]
                  },
                  {
                    "text": "Same but with checkboxes",
                    "opened": true,
                    "children": [
                      {
                        "text": "initially selected",
                        "selected": true
                      },
                      {
                        "text": "custom icon",
                        "icon": "fa fa-warning icon-state-danger"
                      },
                      {
                        "text": "initially open",
                        "icon": "fa fa-folder icon-state-default",
                        "opened": true,
                        "children": [
                          {
                            "text": "Another node"
                          }
                        ]
                      },
                      {
                        "text": "custom icon",
                        "icon": "fa fa-warning icon-state-warning"
                      },
                      {
                        "text": "disabled node",
                        "icon": "fa fa-check icon-state-success",
                        "disabled": true
                      }
                    ]
                  },
                  {
                    "text": "And wholerow selection"
                  }
                ],
                searchText: ''
            }
        },
        methods: {
            itemClick (node) {
              console.log(node.model.text + ' clicked !')
            },
            inputKeyUp: function () {
                var text = this.searchText
                const patt = new RegExp(text);
                this.$refs.tree.handleRecursionNodeChilds(this.$refs.tree, function (node) {
                  if (text !== '' && node.model !== undefined) {
                      const str = node.model.text
                      if (patt.test(str)) {
                          node.$el.querySelector('.tree-anchor').style.color = 'red'
                      } else {
                          node.$el.querySelector('.tree-anchor').style.color = '#000'
                      } // or other operations
                  } else {
                      node.$el.querySelector('.tree-anchor').style.color = '#000'
                  }
                })
            },
            itemDropBefore (node, item, draggedItem , e) {
                if (!draggedItem) {
                  item.addChild({
                      text: "newNode",
                      value: "newNode"
                  })
                }
            },
            itemDrop (node, item, draggedItem , e) {
                var sortBy = function(attr,rev) {
                  if (rev == undefined) {
                      rev = 1;
                  } else {
                      rev = (rev) ? 1 : -1;
                  }
                  return function (a, b) {
                      a = a[attr];
                      b = b[attr];
                      if (a < b) {
                          return rev * -1;
                      }
                      if (a > b) {
                          return rev * 1;
                      }
                      return 0;
                  }
                }
                item.children.sort(sortBy('text', true))
                this.$refs.tree.handleRecursionNodeChildren(draggedItem, function (childrenItem) {
                  childrenItem.selected = item.selected
                })
                console.log(node.model.text + ' drop !')
            }
        }
    }
</script>
