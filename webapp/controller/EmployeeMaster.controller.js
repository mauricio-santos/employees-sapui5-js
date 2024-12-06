sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller 
     * @param {typeof sap.ui.model.Filter} Filter 
     * @param {typeof sap.ui.model.FilterOperator} FilterOperator 
     * @param {typeof sap.ui.core.Fragment} Fragment 
     */
    function (Controller, Filter, FilterOperator, Fragment) {
        "use strict";

	return Controller.extend("logaligroup.employees.controller.EmployeeMaster", {
        onInit: function() {

        },

        onFilterButtonPress: function () {
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
    },

        onClearFilterButtonPress: function () {
            const oModel = this.getView().getModel("countriesModel");
            oModel.setProperty("/EmployeeId", "");
            oModel.setProperty("/CountryKey", "");

            const oList = this.getView().byId("idEmployeesTable");
            const oBindig = oList.getBinding("items");
            oBindig.filter([])

        },

        onShowCityButtonPress: function () {
            const model = this.getView().getModel("configModel");
            model.setProperty("/visibleCity", true);
            model.setProperty("/visibleBtnShowCity", false);
            model.setProperty("/visibleBtnHideCity", true);
        },

        onHideCityButtonPress: function() {
            const model = this.getView().getModel("configModel");
            model.setProperty("/visibleCity", false);
            model.setProperty("/visibleBtnShowCity", true);
            model.setProperty("/visibleBtnHideCity", false);
        },

        showOrders: function(event) {
            const iconPress = event.getSource();
            const oContext = iconPress.getBindingContext("employeesModel");
            const oView = this.getView();

            if (!this.byId("idOrdersDialog")) {
                Fragment.load({
                    name: "logaligroup.employees.fragments.OrdersDialog",
                    id: oView.getId(),
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    oDialog.bindElement({
                        model: "employeesModel",
                        path: oContext.getPath()
                    })
                    oDialog.open();
                }).catch(e => console.log(e));
            } else {
                this.byId("idOrdersDialog").open();
            }
        },

        onCloseDialogButtonPress: function() {
            this.byId("idOrdersDialog").close();
        }

        
	});
});