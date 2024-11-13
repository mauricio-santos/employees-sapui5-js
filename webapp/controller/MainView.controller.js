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
            const i18nBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
            const oJSONModel = new JSONModel();

            const oModel = {
                employeeId: "12345",
                countryKey: "BR",
                listCountry: [
                    {
                        key: "US",
                        text: i18nBundle.getText("countryUS")
                    },
                    {
                        key: "BR",
                        text: i18nBundle.getText("countryBR")
                    },
                    {
                        key: "ES",
                        text: i18nBundle.getText("countryES")
                    },
                    {
                        key: "PT",
                        text: i18nBundle.getText("countryPT")
                    },
                ]
            }
            oJSONModel.setData(oModel);
            oView.setModel(oJSONModel);
        }

        let Main = Controller.extend("logaligroup.employees.controller.MainView", {});

        Main.prototype.onInit = onInit;

        Main.prototype.onEmployeeIdInputLiveChange = function () {
            const input = this.getView().byId("idEmployeeIdInput");
            const value = input.getValue();
            const maxLength = input.getMaxLength();
            const valueLength = value.length;
            const label = this.getView().byId("idCountryLabel");
            const select = this.getView().byId("idListCountrySelect");

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
