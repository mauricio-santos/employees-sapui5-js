sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "sap/ui/core/UIComponent"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller 
     * @param {typeof sap.ui.model.Filter} Filter 
     * @param {typeof sap.ui.model.FilterOperator} FilterOperator 
     * @param {typeof sap.ui.core.Fragment} Fragment 
     * @param {typeof sap.ui.core.UIComponent} UIComponent 
     */
    function (Controller, Filter, FilterOperator, Fragment, UIComponent) {
        "use strict";

        function onInit() {

        };

        function onFilterButtonPress() {
            const oJSON = this.getView().getModel("countriesModel").getData();
            const countryKey = oJSON.CountryKey;
            const employeeId = oJSON.EmployeeId;
            const filters = [];

            if(countryKey) {
                filters.push(new Filter("Country", FilterOperator.EQ, countryKey))
            } 

            if(employeeId) {
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
            const iconPress = event.getSource();
            const oContext = iconPress.getBindingContext("northwindModel");
            const oView = this.getView();

            if (!this.byId("idOrdersDialog")) {
                Fragment.load({
                    name: "logaligroup.employees.fragments.OrdersDialog",
                    id: oView.getId(),
                    controller: this
                })
                .then(function (oDialog) {
                    oView.addDependent(oDialog);
                    oDialog.bindElement({
                        model: "northwindModel",
                        path: oContext.getPath()
                    })
                    oDialog.open();
                })
                .catch(e => console.log(e));
            } else {
                this.byId("idOrdersDialog").open();
            }
        };

        function onCloseDialogButtonPress() {
            this.byId("idOrdersDialog").close();
        };

        function onColumnListItemPress(event) {
            const selectedItem = event.getSource();
            const oContext = selectedItem.getBindingContext("northwindModel");
            
            //Obtendo o evento
            const oEventBus = sap.ui.getCore().getEventBus();
            //Publicando evento SelectedEmployee no canal EmployeeChanel e enviando oContext como parâmetro
            oEventBus.publish("EmployeeChanel", "SelectedEmployee", oContext);
        };

        function onColumnListItemOrderPress(event) {            
            const orderID = event.getSource().getBindingContext("northwindModel").getObject().OrderID;
            const oRouter = UIComponent.getRouterFor(this);
            oRouter.navTo("RouteOrderDetails", {orderID})
        };

        const Main = Controller.extend("logaligroup.employees.controller.EmployeeMaster", {});
        Main.prototype.onInit = onInit;
        Main.prototype.onFilterButtonPress = onFilterButtonPress;
        Main.prototype.onClearFilterButtonPress = onClearFilterButtonPress;
        Main.prototype.onShowCityButtonPress = onShowCityButtonPress;
        Main.prototype.onHideCityButtonPress = onHideCityButtonPress;
        Main.prototype.showOrders = showOrders;
        Main.prototype.onCloseDialogButtonPress = onCloseDialogButtonPress;
        Main.prototype.onColumnListItemPress = onColumnListItemPress;
        Main.prototype.onColumnListItemOrderPress = onColumnListItemOrderPress;
        return Main;
	}
);