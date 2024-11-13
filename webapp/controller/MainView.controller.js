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
            const oJSONModel = new JSONModel();

            oJSONModel.loadData("./localService/mockdata/Employees.json");

            //Chamada assíncrona. Função é Executada quando o modelo é carrregado
            oJSONModel.attachRequestCompleted(function(oEventModel) {
                console.log(JSON.stringify(oJSONModel.getData()));
            })

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
