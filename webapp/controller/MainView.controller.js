sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller 
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel 
     * @param {typeof sap.ui.model.Filter} Filter 
     * @param {typeof sap.ui.model.FilterOperator} FilterOperator 
     */
    function (Controller, JSONModel, Filter, FilterOperator) {
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

        function onFilterButtonPress() {
            const oJSON = this.getView().getModel("countriesModel").getData();
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
            const oModel = this.getView().getModel("countriesModel");
            oModel.setProperty("/EmployeeId", "");
            oModel.setProperty("/CountryKey", "");

            const oList = this.getView().byId("idEmployeesTable");
            const oBindig = oList.getBinding("items");
            oBindig.filter([])
            
        };

        function onShowCityButtonPress() {
            const model = this.getView().getModel("configModel");
            model.setProperty("/visibleCity", true);
            model.setProperty("/visibleBtnShowCity", false);
            model.setProperty("/visibleBtnHideCity", true);
        };

        function onHideCityButtonPress() {
            const model = this.getView().getModel("configModel");
            model.setProperty("/visibleCity", false);
            model.setProperty("/visibleBtnShowCity", true);
            model.setProperty("/visibleBtnHideCity", false);
        };

        function showOrders(event) {
            const itemPressed = event.getSource();
            const oContext = itemPressed.getBindingContext("employeesModel");
            const oEmployee = oContext.getObject();
            const orders = oEmployee.Orders;
            
            const ordersList = [];
            orders.forEach(order => {
                ordersList.push(new sap.m.ColumnListItem({
                    cells: [
                        new sap.m.Label({ text: order.OrderID}),
                        new sap.m.Label({ text: order.Freight }),
                        new sap.m.Label({ text: order.ShipAddress })
                    ]
                }));
            });

            const newTable = new sap.m.Table({
                columns: [
                    new sap.m.Column({header: new sap.m.Label({ text: "{i18n>orderID}" })}),
                    new sap.m.Column({header: new sap.m.Label({ text: "{i18n>freight}" })}),
                    new sap.m.Column({header: new sap.m.Label({ text: "{i18n>shipAddress}" })})
                ],
                items: ordersList,
                width: "auto"
            }).addStyleClass("sapUiSmallMargin");

            const ordersTable = this.getView().byId("idOrdersHBox");
            ordersTable.destroyItems(); //Previde chamdas duplicadas
            ordersTable.addItem(newTable);
        };     

        const Main = Controller.extend("logaligroup.employees.controller.MainView", {});
        Main.prototype.onInit = onInit;
        Main.prototype.onFilterButtonPress = onFilterButtonPress;
        Main.prototype.onClearFilterButtonPress = onClearFilterButtonPress;
        Main.prototype.onShowCityButtonPress = onShowCityButtonPress;
        Main.prototype.onHideCityButtonPress = onHideCityButtonPress;
        Main.prototype.showOrders = showOrders;

        return Main;
    });
