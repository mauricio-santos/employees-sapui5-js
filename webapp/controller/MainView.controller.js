sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller 
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel 
     * @param {typeof sap.ui.model.Filter} Filter 
     * @param {typeof sap.ui.model.FilterOperator} FilterOperator 
     * @param {typeof sap.m.MessageToast} MessageToast 
     */
    function (Controller, JSONModel, Filter, FilterOperator, MessageToast) {
        "use strict";

        function onInit() {
            const oView = this.getView();

            const employeesModel = new JSONModel();
            employeesModel.loadData("./localService/mockdata/Employees.json");
            oView.setModel(employeesModel, "employeesModel");
            
            const countriesModel = new JSONModel();
            countriesModel.loadData("./localService/mockdata/Countries.json");
            oView.setModel(countriesModel, "countriesModel");

            //Chamada assíncrona. Função é Executada quando o modelo é carrregado
            // oJSONModel.attachRequestCompleted(function(oEventModel) {
            //     console.log(JSON.stringify(oJSONModel.getData()));
            // })

        };

        function onFilterButtonPress() {
            const oJSON = this.getView().getModel().getData();
            const countryKey = oJSON.CountryKey;
            const employeeId = oJSON.EmployeeId;
            const filters = [];

            if (countryKey){
                filters.push(new Filter("Country", FilterOperator.EQ, countryKey))
            }
            
            if (employeeId){
                filters.push(new Filter("EmployeeID", FilterOperator.EQ, employeeId))
            }
            
            const oList = this.getView().byId("idEmployeesTable");
            const oBindig = oList.getBinding("items");
            oBindig.filter(filters)
        };

        function onClearFilterButtonPress() {
            const oModel = this.getView().getModel();
            oModel.setProperty("/EmployeeId", "");
            oModel.setProperty("/CountryKey", "");

            const oList = this.getView().byId("idEmployeesTable");
            const oBindig = oList.getBinding("items");
            oBindig.filter([])
            
        };

        function onColumnListItemPress(event) {            
            const itemPress = event.getSource(); //Obtendo item pressionado
            const oContext = itemPress.getBindingContext(); //Obtendo o contexto
            const oItem = oContext.getObject(); //Obtendo o objeto
            const postalCode = oItem.PostalCode; //Obtendo o código postal

            MessageToast.show(postalCode); 
        }

        const Main = Controller.extend("logaligroup.employees.controller.MainView", {});
        Main.prototype.onInit = onInit;
        Main.prototype.onFilterButtonPress = onFilterButtonPress;
        Main.prototype.onClearFilterButtonPress = onClearFilterButtonPress;
        Main.prototype.onColumnListItemPress = onColumnListItemPress;

        return Main;
    });
