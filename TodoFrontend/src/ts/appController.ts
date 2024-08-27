import * as ko from "knockout";
import * as ResponsiveUtils from "ojs/ojresponsiveutils";
import * as  ResponsiveKnockoutUtils from "ojs/ojresponsiveknockoututils";
import "ojs/ojknockout";
import "ojs/ojmodule-element";
import 'ojs/ojtable';
import ArrayDataProvider = require('ojs/ojarraydataprovider');
import "oj-c/menu-button";
import { MenuItems } from 'oj-c/menu-button';
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

type taskItems = {
    id: number;
    title: string;
    description: string;
    dueDate: Date;
}


class RootViewModel {
    restServerURLTasks: string;
    dataArray: ko.ObservableArray<any>;
    dataprovider: ArrayDataProvider<any, any>;

    // Add dialog fields
    taskTitle: ko.Observable<string | null>;
    taskDesc: ko.Observable<string | null>;
    taskDueDate: ko.Observable<string | null>;

    constructor() {

        this.restServerURLTasks = "http://localhost:8080/task";

        this.taskTitle = ko.observable(null);
        this.taskDesc = ko.observable(null);
        this.taskDueDate = ko.observable(null);

        this.dataArray = ko.observableArray();
        this.dataprovider = new ArrayDataProvider(this.dataArray, {
            keyAttributes: 'id',
            implicitSort: [{ attribute: 'id', direction: 'ascending' }]
        });

        this.fetchRows();
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
            console.log("EDIT")
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


    fetchRows = async () => {
        fetch(this.restServerURLTasks).then(res => {
            if (res.ok) {
              res.json().then(resJson => {
                this.dataArray.removeAll();
                resJson.forEach((element: taskItems) => {
                    this.dataArray.push(element);
                });
                this.dataArray.sort((t1, t2) => {return t1.id - t2.id});
              });
            }
        });
    }

    showAddDialog = (event: ojButtonEventMap["ojAction"]) => {
        (document.getElementById("addDialog") as ojDialog).open();
    }

    createTask = async (event: ojButtonEventMap["ojAction"]) => {
        const row = {
            title: this.taskTitle(),
            description: this.taskDesc(),
            dueDate: this.taskDueDate()?.substring(0, this.taskDueDate()?.length as number - 6) + 'Z',
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
                    (addedRow) => {
                        this.dataArray.push({...addedRow});
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

}

export default new RootViewModel();