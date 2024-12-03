sap.ui.define([
	"sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/GroupHeaderListItem"
], 

/**
 * 
 * @param {typeof sap.ui.core.mvc.Controller} Controller 
 * @param { typeof sap.ui.model.json.JSONModel} JSONModel
 * @param { typeof sap.m.GroupHeaderListItem} GroupHeaderListItem
 * 
 */
    function (Controller, JSONModel, GroupHeaderListItem) {
        "use strict";

        return Controller.extend("logaligroup.employees.controller.ListTypes", {    

            onInit: function() {
                const oJSONModel = new JSONModel();
                const mockdataSource = "./localService/mockdata/ListData.json";
                oJSONModel.loadData(mockdataSource);
                this.getView().setModel(oJSONModel);
            },

            getGroupHeader: function (oGroup){            
                const groupHeaderListItem = new GroupHeaderListItem({
                    title: oGroup.key,
                    upperCase: true,
                    tooltip: oGroup.key
                });
                return groupHeaderListItem;

            }


        });
});