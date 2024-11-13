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

        const Main = Controller.extend("logaligroup.employees.controller.MainView", {});

        Main.prototype.onInit = function() {
            
        }

        Main.prototype.onInputLiveChange = function () {
            const input = this.getView().byId("idEmployeeInput");
            const value = input.getValue();
            const maxLength = input.getMaxLength();
            const valueLength = value.length;
            const label = this.getView().byId("idCountryLabel");
            const select = this.getView().byId("idSelect");

            if (valueLength === maxLength) {
                label.setVisible(true);
                select.setVisible(true);
            } else {
                label.setVisible(false);
                select.setVisible(false);
            }
        };

        return Main;
    });
