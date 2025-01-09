sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent",
    "sap/m/ObjectListItem",
    "sap/m/CustomListItem",
    "sap/m/Label",
    "sap/m/Bar",
    "sap/m/ObjectStatus",
    "sap/m/MessageBox"
], 
/**
 * 
 * @param {typeof sap.ui.core.mvc.Controller} Controller 
 * @param {typeof sap.ui.core.routing.History} History 
 * @param {typeof sap.ui.core.UIComponent} UIComponent 
 * @param {typeof sap.m.ObjectListItem} ObjectListItem 
 * @param {typeof sap.m.CustomListItem} CustomListItem 
 * @param {typeof sap.m.Label} Label 
 * @param {typeof sap.m.Bar} Bar 
 * @param {typeof sap.m.ObjectStatus} ObjectStatus 
 * @param {typeof sap.m.MessageBox} MessageBox 
 */
    function (Controller, History, UIComponent, ObjectListItem, CustomListItem, Label, Bar, ObjectStatus, MessageBox) {
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
        },

        onClearSignatureButtonPress: function(event) {
            const signature = this.byId("idSignature");
            signature.clear()
        },

        factoryOrderDetails: function(listId, oContext) {
            const contextObject = oContext.getObject();
            const sProductRef = "/" + contextObject.Product.__ref;
            const oProduct = oContext.getModel().getProperty(sProductRef);
            oProduct.Currency = "EUR";

            if (contextObject.Quantity <= oProduct.UnitsInStock){
                return new ObjectListItem({
                    title: `{northwindModel>${sProductRef}/ProductName} ({northwindModel>Quantity})`,
                    number: "{parts: [{path: 'northwindModel>UnitPrice'}, {path: 'northwindModel>Currency'}], type: 'sap.ui.model.type.Currency', formatOptions: {showMeasure: false}}",
                    numberUnit: "{northwindModel>Currency}"
                });
            }else{
                return new CustomListItem({
                    content: [
                        new Bar({
                            contentLeft: new Label({ text: `{northwindModel>${sProductRef}/ProductName} ({northwindModel>Quantity})`}),
                            contentMiddle: new ObjectStatus({ text: `{i18n>availableStock} ${oProduct.unitsInStock}`, state: "Error"}),
                            contentRight: new Label({ text: "{parts: [{path: 'northwindModel>UnitPrice'}, {path: 'northwindModel>Currency'}], type: 'sap.ui.model.type.Currency'}" })
                        })
                    ]
                });
            }
        },

        onSaveSignatureButtonPress: function(event) {
            const signature = this.byId("idSignature");
            const oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

            if (!signature.isFill()) {
                MessageBox.error(oResourceBundle.getText("fillSignature"));
            }else {
                const oModel = this.getView().getModel("incidenceModel");
                const oOrder = event.getSource().getBindingContext("northwindModel").getObject();
                const base64 = signature.getSignature().replace("data:image/png;base64,", '');
                
                const body = {
                    OrderId: oOrder.OrderID.toString(),
                    SapId: this.getOwnerComponent().SapId,
                    EmployeeId: oOrder.EmployeeID.toString(),
                    MimeType: "image/png",
                    MediaContent: base64
                };

                oModel.create("/SignatureSet", body, {
                    success: function() {
                        MessageBox.information(oResourceBundle.getText("signatureSaved"));
                    },
                    error: function(e) {
                        MessageBox.error(oResourceBundle.getText("signatureNotSaved") + "\n\n" + e.message);
                    }
                });
            }

            
        }
    });
});