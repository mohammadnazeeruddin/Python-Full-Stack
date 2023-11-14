// console.log(topic)
//     for (let material of this.material_data) {
//         console.log(material, "materail")
//       let children = []
//       for (let chapter of material['chapter_data']) {
//         // children_data['name'] = chapter['chapter_name']
//         console.log(chapter, "chapter")
//         let page_data = []
//         for (let pages of chapter['page_data']) {
//           let page_child = {}
//           page_child['name'] = pages['page_name']
//           page_data.push(page_child)
//         }
//         children.push({ 'name': chapter['chapter_name'], 'children': page_data })
//       }
//     this.tree_data.push({'name':material['material_name'], 'children': children})
//     }
//     console.log(this.tree_data)

// this.tree_data = []
// let children = []
// console.log(this.material_data)
// for (let material of this.material_data) {
//   if (material['material_name'] == topic) {
//     let children = []
//     for (let chapter of material['chapter_data']) {
//       let page_data = []
//       for (let pages of chapter['page_data']) {
//         let page_child = {}
//         page_child['name'] = pages['page_name']
//         page_data.push(page_child)
//       }
//       children.push({ 'name': chapter['chapter_name'], 'children': page_data })
//     }
//     this.tree_data.push({ 'name': material['material_name'], 'children': children })
//     break
//   }
//   else {
//     for (let chapter of material['chapter_data']) {
//       console.log(material, chapter, chapter['chapter_name'], topic)
//       if (chapter['chapter_name'] == topic) {
//         let page_data = []
//         for (let pages of chapter['page_data']) {
//           let page_child = {}
//           page_child['name'] = pages['page_name']
//           page_data.push(page_child)
//         }
//         children.push({ 'name': chapter['chapter_name'], 'children': page_data })
//         this.tree_data.push({ 'name': material['material_name'], 'children': children })
//         break
//       }
//     }
//   }
// }
// this.treeControl = new NestedTreeControl<any>(node => node.children);
// this.tree_dataSource = new ArrayDataSource(this.tree_data);
// this.hasChild = (_: number, node: any) => !!node.children && node.children.length > 0

// console.log(this.tree_data)
// this.tree_data = []
//     let children = []
//     console.log(this.material_data)
//     for (let material of this.material_data) {
//       if (material['material_name'] == topic) {
//         let children = []
//         for (let chapter of material['chapter_data']) {
//           let page_data = []
//           for (let pages of chapter['page_data']) {
//             let page_child = {}
//             page_child['name'] = pages['page_name']
//             page_data.push(page_child)
//           }
//           children.push({ 'name': chapter['chapter_name'], 'children': page_data })
//         }
//         this.tree_data.push({ 'name': material['material_name'], 'children': children })
//         break
//       }
//       else {
//         for (let chapter of material['chapter_data']) {
//           console.log(material, chapter, chapter['chapter_name'], topic)
//           if (chapter['chapter_name'] == topic) {
//             let page_data = []
//             for (let pages of chapter['page_data']) {
//               let page_child = {}
//               page_child['name'] = pages['page_name']
//               page_data.push(page_child)
//             }
//             children.push({ 'name': chapter['chapter_name'], 'children': page_data })
//             break

//           }
//         }
//       }

export var material_data: Array<object> =
    [
        {
            "chapter_data": [
                {
                    "chapter_id": "676bd2a5-c068-4778-97df-23704c6eef1f",
                    "chapter_name": "Introduction",
                    "page_data": [
                        {
                            "page_name": "History",
                            "page_number": 1
                        },
                        {
                            "page_name": "Why Python?",
                            "page_number": 2
                        },
                        {
                            "page_name": "Features of Python",
                            "page_number": 3
                        },
                        {
                            "page_name": "Quick Test",
                            "page_number": 4
                        },
                        {
                            "page_name": "Installation",
                            "page_number": 5
                        }
                    ]
                },
                {
                    "chapter_id": "9908d136-937b-4e2b-8483-16d66e441927",
                    "chapter_name": "Dev Environment",
                    "page_data": [
                        {
                            "page_name": "Python Shell",
                            "page_number": 1
                        },
                        {
                            "page_name": "Quick Test",
                            "page_number": 2
                        },
                        {
                            "page_name": "Python IDE",
                            "page_number": 3
                        }
                    ]
                },
                {
                    "chapter_id": "dc7a0875-11f2-43e4-8d17-8a42b74382da",
                    "chapter_name": "Values & Variables",
                    "page_data": [
                        {
                            "page_name": "Data",
                            "page_number": 1
                        },
                        {
                            "page_name": "Need for variables",
                            "page_number": 2
                        },
                        {
                            "page_name": "Quick Test",
                            "page_number": 3
                        }
                    ]
                },
                {
                    "chapter_id": "93095152-58d6-4418-adce-adb06a99740a",
                    "chapter_name": "Data Types",
                    "page_data": [
                        {
                            "page_name": "Primitive Types",
                            "page_number": 1
                        },
                        {
                            "page_name": "Composite Types",
                            "page_number": 2
                        },
                        {
                            "page_name": "Binary Types",
                            "page_number": 3
                        },
                        {
                            "page_name": "Quick Test",
                            "page_number": 4
                        },
                        {
                            "page_name": "The Language Which Knew Infinity",
                            "page_number": 5
                        },
                        {
                            "page_name": "Console input, output",
                            "page_number": 6
                        },
                        {
                            "page_name": "Type Conversions",
                            "page_number": 7
                        },
                        {
                            "page_name": "Quick Test",
                            "page_number": 8
                        },
                        {
                            "page_name": "Python Memory Model",
                            "page_number": 9
                        },
                        {
                            "page_name": "Quick Test",
                            "page_number": 10
                        }
                    ]
                },
                {
                    "chapter_id": "ed8590e1-e3ba-4f86-b40d-40080657c0e3",
                    "chapter_name": "Operators",
                    "page_data": [
                        {
                            "page_name": "Introduction",
                            "page_number": 1
                        },
                        {
                            "page_name": "Arithmetic Operators",
                            "page_number": 2
                        },
                        {
                            "page_name": "Quick Test",
                            "page_number": 3
                        },
                        {
                            "page_name": "Relational operators",
                            "page_number": 4
                        },
                        {
                            "page_name": "Logical Operators",
                            "page_number": 5
                        },
                        {
                            "page_name": "Short-hand assignment operators",
                            "page_number": 6
                        },
                        {
                            "page_name": "Bitwise Operators",
                            "page_number": 7
                        },
                        {
                            "page_name": "Membership operators",
                            "page_number": 8
                        },
                        {
                            "page_name": "Identity operators",
                            "page_number": 9
                        }
                    ]
                },
                {
                    "chapter_id": "06f2e505-43ec-43e6-b22a-056674d68a52",
                    "chapter_name": "Strings",
                    "page_data": [
                        {
                            "page_name": "Strings",
                            "page_number": 1
                        },
                        {
                            "page_name": "Quick Test",
                            "page_number": 2
                        },
                        {
                            "page_name": "String Slicing",
                            "page_number": 3
                        },
                        {
                            "page_name": "Quick Test",
                            "page_number": 4
                        },
                        {
                            "page_name": "-Ve indexing",
                            "page_number": 5
                        },
                        {
                            "page_name": "Quick Test",
                            "page_number": 6
                        },
                        {
                            "page_name": "String functions - 1",
                            "page_number": 7
                        },
                        {
                            "page_name": "String functions - 2",
                            "page_number": 8
                        },
                        {
                            "page_name": "Quick Test",
                            "page_number": 9
                        },
                        {
                            "page_name": "String Validation Functions",
                            "page_number": 10
                        },
                        {
                            "page_name": "Quick Test",
                            "page_number": 11
                        }
                    ]
                },
                {
                    "chapter_id": "58fea321-d1e0-4c54-9ee6-07097be2f818",
                    "chapter_name": "Control Structures",
                    "page_data": [
                        {
                            "page_name": "Introduction",
                            "page_number": 1
                        },
                        {
                            "page_name": "Conditional Statements",
                            "page_number": 2
                        },
                        {
                            "page_name": "Special use cases",
                            "page_number": 3
                        },
                        {
                            "page_name": "Quick Test",
                            "page_number": 4
                        },
                        {
                            "page_name": "Looping (while, while-else)",
                            "page_number": 5
                        },
                        {
                            "page_name": "Looping (for, for-else)",
                            "page_number": 6
                        },
                        {
                            "page_name": "Unconditional statements",
                            "page_number": 7
                        },
                        {
                            "page_name": "Quick Test",
                            "page_number": 8
                        },
                        {
                            "page_name": "Excercise for Non-Programmers",
                            "page_number": 9
                        },
                        {
                            "page_name": "Excercise for Programmers",
                            "page_number": 10
                        }
                    ]
                },
                {
                    "chapter_id": "0fa3edfb-c9b4-40c2-bfd1-0b369ae35095",
                    "chapter_name": "Data Structures",
                    "page_data": [
                        {
                            "page_name": "Introduction",
                            "page_number": 1
                        },
                        {
                            "page_name": "List - Homogeneous",
                            "page_number": 2
                        },
                        {
                            "page_name": "Tuple - Heterogeneous",
                            "page_number": 3
                        },
                        {
                            "page_name": "List of tuples",
                            "page_number": 4
                        },
                        {
                            "page_name": "Difference between List and Tuple",
                            "page_number": 5
                        },
                        {
                            "page_name": "Built-in functions on sequences",
                            "page_number": 6
                        },
                        {
                            "page_name": "More built-in functions in python",
                            "page_number": 7
                        },
                        {
                            "page_name": "Lambda",
                            "page_number": 8
                        },
                        {
                            "page_name": "Set - Mathematical operations",
                            "page_number": 9
                        },
                        {
                            "page_name": "Set - Use Cases",
                            "page_number": 10
                        },
                        {
                            "page_name": "Dictionary",
                            "page_number": 11
                        },
                        {
                            "page_name": "Dictionary - Use Cases",
                            "page_number": 12
                        }
                    ]
                },
                {
                    "chapter_id": "e61a7fe0-3f0c-4372-944e-98c82b6b9f73",
                    "chapter_name": "Functions",
                    "page_data": [
                        {
                            "page_name": "Why Functions?",
                            "page_number": 1
                        },
                        {
                            "page_name": "Scope",
                            "page_number": 2
                        },
                        {
                            "page_name": "copy - shallow copy",
                            "page_number": 3
                        },
                        {
                            "page_name": "Recursion",
                            "page_number": 4
                        },
                        {
                            "page_name": "Decorators",
                            "page_number": 5
                        },
                        {
                            "page_name": "Closure",
                            "page_number": 6
                        },
                        {
                            "page_name": "Generator",
                            "page_number": 7
                        }
                    ]
                },
                {
                    "chapter_id": "35578056-669a-4022-9383-eaaee272368c",
                    "chapter_name": "Modules",
                    "page_data": [
                        {
                            "page_name": "Introduction",
                            "page_number": 1
                        },
                        {
                            "page_name": "Python Code files",
                            "page_number": 2
                        },
                        {
                            "page_name": "Package",
                            "page_number": 3
                        },
                        {
                            "page_name": "Preventing execution of unwanted code",
                            "page_number": 4
                        },
                        {
                            "page_name": "Recursive imports",
                            "page_number": 5
                        },
                        {
                            "page_name": "Hiding symbols from import *",
                            "page_number": 6
                        }
                    ]
                },
                {
                    "chapter_id": "26800678-fbdf-4e2e-837b-3d4ecafa9dd6",
                    "chapter_name": "File IO",
                    "page_data": [
                        {
                            "page_name": "Introduction",
                            "page_number": 1
                        },
                        {
                            "page_name": "File creation and writing",
                            "page_number": 2
                        },
                        {
                            "page_name": "Storing data as CSV file",
                            "page_number": 3
                        },
                        {
                            "page_name": "Reading data from CSV file",
                            "page_number": 4
                        },
                        {
                            "page_name": "Useful functions from the os module",
                            "page_number": 5
                        }
                    ]
                },
                {
                    "chapter_id": "8e142ba2-6034-4d26-80bd-1ea59482894f",
                    "chapter_name": "Comprehensions",
                    "page_data": [
                        {
                            "page_name": "List Comprehension",
                            "page_number": 1
                        },
                        {
                            "page_name": "Tuple comprehension",
                            "page_number": 2
                        },
                        {
                            "page_name": "Set Comprehension",
                            "page_number": 3
                        },
                        {
                            "page_name": "Dictionary Comprehension",
                            "page_number": 4
                        },
                        {
                            "page_name": "Functional Programming",
                            "page_number": 5
                        },
                        {
                            "page_name": "Lambda",
                            "page_number": 6
                        }
                    ]
                },
                {
                    "chapter_id": "fff3b80e-456e-4723-858e-19f8220f91d3",
                    "chapter_name": "Serialization",
                    "page_data": [
                        {
                            "page_name": "Intoduction",
                            "page_number": 1
                        },
                        {
                            "page_name": "Pickle",
                            "page_number": 2
                        },
                        {
                            "page_name": "Xml ",
                            "page_number": 3
                        },
                        {
                            "page_name": "JSON",
                            "page_number": 4
                        }
                    ]
                }
            ],
            "material_id": "6a2d29db-2548-4425-9bed-c72271ab71f5",
            "material_name": "Python"
        },
        {
            "chapter_data": [
                {
                    "chapter_id": "68b00bfd-b1fa-40d3-b602-998863183e0a",
                    "chapter_name": "Object Orientation (OOPS)",
                    "page_data": [
                        {
                            "page_name": "Introduction",
                            "page_number": 1
                        },
                        {
                            "page_name": "Static variables, Static Methods and Class Methods",
                            "page_number": 2
                        },
                        {
                            "page_name": "Decorator and Context manager",
                            "page_number": 3
                        },
                        {
                            "page_name": "Function Overloading",
                            "page_number": 4
                        },
                        {
                            "page_name": "Operator overloading",
                            "page_number": 5
                        }
                    ]
                },
                {
                    "chapter_id": "b9d432ec-a0cf-4100-9a3a-d12d14daf7dd",
                    "chapter_name": "Exception Handling",
                    "page_data": [
                        {
                            "page_name": "Purpose and Usage",
                            "page_number": 1
                        },
                        {
                            "page_name": "Writing custom exceptions classes",
                            "page_number": 2
                        }
                    ]
                },
                {
                    "chapter_id": "32a2c71e-a120-4b6b-b276-3036b98b6024",
                    "chapter_name": "MySQL DB Walk-through",
                    "page_data": [
                        {
                            "page_name": "MySQL Installation",
                            "page_number": 1
                        },
                        {
                            "page_name": "Creating User",
                            "page_number": 2
                        },
                        {
                            "page_name": "Employee DB setup",
                            "page_number": 3
                        }
                    ]
                },
                {
                    "chapter_id": "23186993-0924-4435-a594-698e49502a43",
                    "chapter_name": "MySQL DB Connection",
                    "page_data": [
                        {
                            "page_name": "mysql-connector-python installation",
                            "page_number": 1
                        },
                        {
                            "page_name": "Fetching Records ",
                            "page_number": 2
                        }
                    ]
                },
                {
                    "chapter_id": "869b4549-2af1-4405-9e6d-a388fe7aa4f0",
                    "chapter_name": "Mongo DB Walk-through",
                    "page_data": []
                },
                {
                    "chapter_id": "1d2d3c54-7bab-4312-8907-a44730645b0a",
                    "chapter_name": "MS-SQL Server Connection",
                    "page_data": []
                },
                {
                    "chapter_id": "84991853-6129-45d7-8fc9-a77fa0ba936a",
                    "chapter_name": "Logging",
                    "page_data": []
                },
                {
                    "chapter_id": "aec28e7b-8279-4e6d-9912-c7078b6377f3",
                    "chapter_name": "Threading",
                    "page_data": []
                },
                {
                    "chapter_id": "780c6549-c682-450f-9fd3-7f0bb9019975",
                    "chapter_name": "Email-FTP",
                    "page_data": [
                        {
                            "page_name": "Sending Email",
                            "page_number": 1
                        },
                        {
                            "page_name": "Using FTP",
                            "page_number": 2
                        }
                    ]
                },
                {
                    "chapter_id": "8a537923-7ab2-457d-b759-55b6baa9b3ce",
                    "chapter_name": "Regular Expressions",
                    "page_data": [
                        {
                            "page_name": "re module",
                            "page_number": 1
                        }
                    ]
                }
            ],
            "material_id": "77f5e51e-d6e0-461d-818c-2533d9979394",
            "material_name": "Advanced Python"
        },
        {
            "chapter_data": [
                {
                    "chapter_id": "31f54c18-9a89-4cd4-b241-446abd69c570",
                    "chapter_name": "Numpy",
                    "page_data": []
                },
                {
                    "chapter_id": "e9ce7abc-63f3-40c7-abba-4254aa2b3ca0",
                    "chapter_name": "Pandas",
                    "page_data": []
                }
            ],
            "material_id": "61ba77da-e1d7-4c73-b6aa-57e0fe72ad60",
            "material_name": "Data Analysis"
        },
        {
            "chapter_data": [
                {
                    "chapter_id": "eaf87b44-7700-4fca-af01-31b86e96be46",
                    "chapter_name": "Building REST APIs with Django",
                    "page_data": [
                        {
                            "page_name": "Introduction",
                            "page_number": 1
                        },
                        {
                            "page_name": "Project Setup",
                            "page_number": 2
                        }
                    ]
                }
            ],
            "material_id": "2733fe14-4301-4590-858a-d49918eba9f2",
            "material_name": "Django"
        },
        {
            "chapter_data": [
                {
                    "chapter_id": "6112d99f-d09d-4b42-b87a-8c14750b5fc8",
                    "chapter_name": "Building REST APIs with Flask",
                    "page_data": [
                        {
                            "page_name": "Introduction",
                            "page_number": 1
                        },
                        {
                            "page_name": "Installation",
                            "page_number": 2
                        }
                    ]
                }
            ],
            "material_id": "12f45456-03f2-499b-8ef3-bb194a58b68d",
            "material_name": "Flask"
        }
    ]