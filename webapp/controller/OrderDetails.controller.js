sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent"
], 
/**
 * 
 * @param {typeof sap.ui.core.mvc.Controller} Controller 
 * @param {typeof sap.ui.core.routing.History} History 
 * @param {typeof sap.ui.core.UIComponent} UIComponent 
 * @returns 
 */
    function (Controller, History, UIComponent) {
    "use strict";

        function _onObjectMatched(event) {
            const orderID = event.getParameter("arguments").orderID;
            this.getView().bindElement({
                path: `/Orders(${orderID})`,
                model: "northwindModel"
            })
        }

    return Controller.extend("logaligroup.employees.controller.OrderDetails", {

        onInit: function() {          
            const oRouter = UIComponent.getRouterFor(this);
            oRouter.getRoute("RouteOrderDetails").attachPatternMatched(_onObjectMatched, this);

        },

        onButtonBackPress: function(event) {
            const oHistory = History.getInstance();
            const sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined){
                window.history.go(-1);
            }else {
                const oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("RouteMainView");
            }
        }
    });
});