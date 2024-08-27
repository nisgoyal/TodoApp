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
        (document.getElementById("addDialog") as ojDialog).close();
    }

}

export default new RootViewModel();