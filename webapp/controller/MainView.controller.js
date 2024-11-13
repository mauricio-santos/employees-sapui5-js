sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
function (Controller) {
    "use strict";

    return Controller.extend("logaligroup.employees.controller.MainView", {
        onInit: function () {

        },

        onInputLiveChange: function () {
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
        }
    });
});
