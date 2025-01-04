sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent"
],
    /**
     * 
     * @param {typeof sap.ui.core.mvc.Controller} Controller 
     * @param {typeof sap.ui.core.UIComponent} UIComponent 
     * 
     */
    function (Controller, UIComponent) {
        "use strict";

        return Controller.extend("logaligroup.employees.controller.Base", {
            onColumnListItemOrderPress: function(event) {
            const orderID = event.getSource().getBindingContext("northwindModel").getObject().OrderID;
            const oRouter = UIComponent.getRouterFor(this);
            oRouter.navTo("RouteOrderDetails", { orderID });
            }
        });
    });