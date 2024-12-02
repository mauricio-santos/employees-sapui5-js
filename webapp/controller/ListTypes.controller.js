sap.ui.define([
	"sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], 

/**
 * 
 * @param {typeof sap.ui.core.mvc.Controller} Controller 
 * @param { typeof sap.ui.model.json.JSONModel} JSONModel 
 * 
 */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("logaligroup.employees.controller.ListTypes", {    

            onInit: function() {
                const oJSONModel = new JSONModel();
                const mockdataSource = "./localService/mockdata/ListData.json";
                oJSONModel.loadData(mockdataSource);
            }


        });
});