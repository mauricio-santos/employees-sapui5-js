sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller 
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel 
     */
    function (Controller, JSONModel) {
        "use strict";

        function onInit() {
            const oView = this.getView();

            const employeesModel = new JSONModel();
            employeesModel.loadData("./localService/mockdata/Employees.json");
            oView.setModel(employeesModel, "employeesModel");
            
            const countriesModel = new JSONModel();
            countriesModel.loadData("./localService/mockdata/Countries.json");
            oView.setModel(countriesModel, "countriesModel");

            const configModel = new JSONModel({
                visibleId: true,
                visibleName: true,
                visibleCountry: true,
                visibleCity: false,
                visibleBtnShowCity: true,
                visibleBtnHideCity: false
            });
            oView.setModel(configModel, "configModel");
        };

        const Main = Controller.extend("logaligroup.employees.controller.Main", {});
        Main.prototype.onInit = onInit;
        return Main;
    });
