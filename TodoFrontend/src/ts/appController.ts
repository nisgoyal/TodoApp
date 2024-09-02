import * as ko from "knockout";
import * as ResponsiveUtils from "ojs/ojresponsiveutils";
import * as  ResponsiveKnockoutUtils from "ojs/ojresponsiveknockoututils";
import "ojs/ojknockout";
import "ojs/ojmodule-element";
import 'ojs/ojtable';
import ArrayDataProvider = require('ojs/ojarraydataprovider');
import "oj-c/menu-button";
import "oj-c/button";
import { ojButtonEventMap } from "ojs/ojbutton";
import { ojDialog } from "ojs/ojdialog";
import "ojs/ojdialog";
import "ojs/ojlabel";
import "ojs/ojinputtext";
import "oj-c/input-text";
import * as Bootstrap from "ojs/ojbootstrap";
import "ojs/ojdatetimepicker";
import 'ojs/ojmenu';
import 'ojs/ojbutton';
import 'ojs/ojoption';
import { ojMenuEventMap } from "ojs/ojmenu";
import { ojTable } from "ojs/ojtable";
import 'ojs/ojinputsearch';
import { KeySetImpl, AllKeySetImpl } from 'ojs/ojkeyset';
import 'ojs/ojselectcombobox';

type tagItem = {
    name: string;
}

type taskItems = {
    id: number;
    title: string;
    description: string;
    dueDate: string;
    tags: { name: string }[];
}


class RootViewModel {
    restServerURLTasks: string;
    dataArray: ko.ObservableArray<any>;
    dataprovider: ArrayDataProvider<any, any>;
    filteredDataArray: ko.ObservableArray<any>;

    // Add dialog fields
    taskTitle: ko.Observable<string | null>;
    taskDesc: ko.Observable<string | null>;
    taskDueDate: ko.Observable<string | null>;

    // Edit dialog fields
    editTaskIndex: number;
    editTaskId: ko.Observable<number | null>;
    editTaskTitle: ko.Observable<string | null>;
    editTaskDesc: ko.Observable<string | null>;
    editTaskDueDate: ko.Observable<string | null>;

    // search fields
    searchValue: ko.Observable<string | null>;
    searchRawValue: ko.Observable<string | null>;

    // show tag field
    tagFieldKey: ko.Observable<number | null>;
    tagFieldValue: ko.ObservableArray<string>;

    //
    restServerURLTags: string;
    tagArray: ko.ObservableArray<any>;
    tagDataProvider: ArrayDataProvider<any, any>;


    constructor() {

        this.searchValue = ko.observable(null);
        this.searchRawValue = ko.observable(null);

        this.restServerURLTasks = "http://localhost:8080/task";

        this.taskTitle = ko.observable(null);
        this.taskDesc = ko.observable(null);
        this.taskDueDate = ko.observable(null);

        this.editTaskIndex = -1;
        this.editTaskId = ko.observable(null);
        this.editTaskTitle = ko.observable(null);
        this.editTaskDesc = ko.observable(null);
        this.editTaskDueDate = ko.observable(null);

        this.dataArray = ko.observableArray();
        this.filteredDataArray = ko.observableArray();
        this.dataprovider = new ArrayDataProvider(this.filteredDataArray, {
            keyAttributes: 'id',
            implicitSort: [{ attribute: 'id', direction: 'ascending' }]
        });

        this.tagFieldKey = ko.observable(null);
        this.tagFieldValue = ko.observableArray();


        this.restServerURLTags = "http://localhost:8080/tag";
        this.tagArray = ko.observableArray();
        this.tagDataProvider = new ArrayDataProvider(this.tagArray, {
            keyAttributes: 'name'
        })

        this.fetchTags();
        this.fetchRows();
        this.searchValue.subscribe(this.filterTaskTable);
        this.dataArray.subscribe(this.filterTaskTable);
    }


    filterTaskTable = () => {
        if(this.searchValue() === null || this.searchValue() === "") {
            this.filteredDataArray(this.dataArray());
        }
        else {
            this.filteredDataArray(ko.utils.arrayFilter(this.dataArray(), (task: taskItems) => {

                let presentInTag = false;
                task.tags.forEach((tag: tagItem) => {
                    if (tag.name.includes(this.searchValue() as string)) {
                        presentInTag = true;
                    }
                });

                return presentInTag || task.title.includes(this.searchValue() as string) ||
                    task.description.includes(this.searchValue() as string) ||
                    task.id.toString().includes(this.searchValue() as string);
            }));
        }
    }


    isoToOjetFormat = (isoDateString: string) => {
        // Convert to Date object
        var dateObj = new Date(isoDateString);

        // Get the timezone offset in minutes and convert it to hours and minutes
        var timezoneOffset = -dateObj.getTimezoneOffset();
        var offsetHours = Math.floor(Math.abs(timezoneOffset) / 60);
        var offsetMinutes = Math.abs(timezoneOffset) % 60;
        var offsetSign = timezoneOffset >= 0 ? '+' : '-';

        // Format hours and minutes with leading zeros if necessary
        var offsetHoursStr = offsetHours.toString().padStart(2, '0');
        var offsetMinutesStr = offsetMinutes.toString().padStart(2, '0');

        // Construct the timezone offset string
        var timezoneOffsetString = `${offsetSign}${offsetHoursStr}:${offsetMinutesStr}`;

        // Format date to "YYYY-MM-DDTHH:mm:ss"
        var formattedDate = dateObj.getFullYear() +
            '-' + (dateObj.getMonth() + 1).toString().padStart(2, '0') +
            '-' + dateObj.getDate().toString().padStart(2, '0') +
            'T' + dateObj.getHours().toString().padStart(2, '0') +
            ':' + dateObj.getMinutes().toString().padStart(2, '0') +
            ':' + dateObj.getSeconds().toString().padStart(2, '0');

        // Combine the formatted date and the timezone offset
        var ojDateTimePickerFormat = `${formattedDate}${timezoneOffsetString}`;
        return ojDateTimePickerFormat;
    }


    menuListener = (
        event: ojMenuEventMap["ojMenuAction"],
        context: ojTable.CellTemplateContext<taskItems["id"], taskItems>
    ) => {
        const tableComponent = document.getElementById('table') as ojTable<
            taskItems['id'],
            taskItems
        >;
        const currentRow = tableComponent.currentRow;
        if (event.detail.selectedValue === 'delete') {
            if (currentRow?.rowIndex !== undefined && currentRow?.rowKey !== undefined){
                this.removeRow(currentRow?.rowKey);
            }
        }
        else if (event.detail.selectedValue === 'edit') {
            if(currentRow?.rowKey !== undefined) {
                this.showEditDialog(currentRow?.rowKey);
            }
        }
    };


    deleteSelectedRows = () => {
        const tableComponent = document.getElementById('table') as ojTable<
            taskItems['id'], 
            taskItems
        >;
        
        if ((tableComponent.selected.row as AllKeySetImpl<number>).keys.all) {
            // all selected
            this.dataArray().forEach((item) => {
                this.removeRow(item.id);
            });
        }
        else {
            let keySet = (tableComponent.selected.row as AllKeySetImpl<number>).keys.keys?.values();
            let next = -1 as any;
            while( (next = keySet?.next())?.done === false ) {
                if (next !== undefined) {
                    this.removeRow(next.value);
                }
            }
        }
    }


    fetchTags = async () => {
        fetch(this.restServerURLTags).then(res => {
            if (res.ok) {
                res.json().then(resJson => {
                    this.tagArray.removeAll();
                    resJson.forEach((element: { name: string }) => {
                        this.tagArray.push(
                            {'value': element.name}
                        )
                    });
                });
            }
        });
    }

    fetchRows = async () => {
        fetch(this.restServerURLTasks).then(res => {
            if (res.ok) {
              res.json().then(resJson => {
                this.dataArray.removeAll();
                resJson.forEach((element: taskItems) => {
                    this.dataArray.push(
                        {
                            ...element,
                        }
                    );
                });
                this.dataArray.sort((t1, t2) => {return t1.id - t2.id});
                this.filterTaskTable();
              });
            }
        });
    }

    showAddDialog = (event: ojButtonEventMap["ojAction"]) => {
        this.taskTitle(null);
        this.taskDesc(null);
        this.taskDueDate(null);
        (document.getElementById("addDialog") as ojDialog).open();
    }

    showEditDialog = (rowKey: number) => {
        let rowIndex = -1;
        this.dataArray().forEach((item: taskItems, index: number) => {
            if (item.id === rowKey) {
                rowIndex = index;
            }
        });
        if (rowIndex !== -1) {
            let taskItem = this.dataArray()[rowIndex] as taskItems;
            this.editTaskIndex = rowIndex;
            this.editTaskId(taskItem.id);
            this.editTaskTitle(taskItem.title);
            this.editTaskDesc(taskItem.description);
            this.editTaskDueDate(this.isoToOjetFormat(taskItem.dueDate));
            (document.getElementById("editDialog") as ojDialog).open();
        }
    }

    editTask = async (event: ojButtonEventMap["ojAction"]) => {
        const row = {
            id: this.editTaskId(),
            title: this.editTaskTitle(),
            description: this.editTaskDesc(),
            dueDate: new Date(this.editTaskDueDate() as string).toISOString(),
        };

        fetch(this.restServerURLTasks + `/${this.editTaskId()}`, {
            headers: new Headers({
            "Content-type": "application/json; charset=UTF-8",
            }),
            body: JSON.stringify(row),
            method: "PUT",
        }).then((res) => {
            if (res.ok) {
                console.log("Data updated successfully");
                this.dataArray.replace(
                    this.dataArray()[this.editTaskIndex],
                    {
                        ...row,
                    }
                );
            }
            else {
                console.log("Error updating data!");
            }
        });
        (document.getElementById("editDialog") as ojDialog).close();
    }

    createTask = async (event: ojButtonEventMap["ojAction"]) => {
        const row = {
            title: this.taskTitle(),
            description: this.taskDesc(),
            dueDate: new Date(this.taskDueDate() as string).toISOString(),
        };

        fetch(this.restServerURLTasks, {
            headers: new Headers({
            "Content-type": "application/json; charset=UTF-8",
            }),
            body: JSON.stringify(row),
            method: "POST",
        }).then((res) => {
            if (res.ok) {
                console.log("Data added successfully");
                res.json().then(
                    (addedRow: taskItems) => {
                        this.dataArray.push({
                            ...addedRow,
                        });
                    }
                )
            }
            else {
                console.log("Error adding data!");
            }
        });
        (document.getElementById("addDialog") as ojDialog).close();
    }

    removeRow = async (rowKey: number) => {
        fetch(
            this.restServerURLTasks + `/${rowKey}`,
            {
                method: 'DELETE'
            }
        ).then((res) => {
            if (res.ok) {
                console.log("deleted successfully! ", rowKey)
                this.dataArray.remove((task: taskItems) => {
                    return task.id === rowKey
                });
            }
            else {
                console.log("delete failed");
            }
        });
    }

    enableTagEdit = (cell: any) => {
        this.tagFieldKey(cell.key);
        let fieldValue = [] as string[];
        (cell.data as Array<any>).forEach((item: any) => {
            fieldValue.push(item.name)
        });
        this.tagFieldValue(fieldValue);
    }

    cancelTagEdit = () => {
        this.tagFieldKey(null);
        this.tagFieldValue([]);
    }

    submitTagEdit = () => {
        if (this.tagFieldValue()) {
            let rowIndex = -1;
            this.dataArray().forEach((item: taskItems, index: number) => {
                if (item.id === this.tagFieldKey()) {
                    rowIndex = index;
                }
            });
            let tags = [] as {name: string}[]
            this.tagFieldValue().forEach((tag: string) => {
                tags.push(
                    {
                        "name": tag
                    }
                )
            });
            let row = {
                id: this.tagFieldKey(),
                title: this.dataArray()[rowIndex].title,
                description: this.dataArray()[rowIndex].description,
                dueDate: this.dataArray()[rowIndex].dueDate,
                tags: tags,
            };
            fetch(
                this.restServerURLTasks + `/${this.tagFieldKey()}`,
                {
                    headers: new Headers({
                        "Content-type": "application/json; charset=UTF-8",
                    }),
                    body: JSON.stringify(row),
                    method: "PUT",
                }
            ).then((res) => {
                if (res.ok) {
                    console.log("Tags updated successfully");
                    this.dataArray.replace(
                        this.dataArray()[rowIndex],
                        {
                            ...row,
                        }
                    );
                }
                else {
                    console.log("Error updating tags!");
                }
            });
        }

        this.tagFieldKey(null);
        this.tagFieldValue([]);
    }
}

export default new RootViewModel();