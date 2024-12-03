sap.ui.define([
	"sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/GroupHeaderListItem",
    "sap/m/MessageToast"
], 

/**
 * 
 * @param {typeof sap.ui.core.mvc.Controller} Controller 
 * @param { typeof sap.ui.model.json.JSONModel} JSONModel
 * @param { typeof sap.m.GroupHeaderListItem} GroupHeaderListItem
 * @param { typeof sap.m.MessageToast} MessageToast
 * 
 */
    function (Controller, JSONModel, GroupHeaderListItem, MessageToast) {
        "use strict";

        return Controller.extend("logaligroup.employees.controller.ListTypes", {    

            onInit: function() {
                const oJSONModel = new JSONModel();
                const mockdataSource = "./localService/mockdata/ListData.json";
                oJSONModel.loadData(mockdataSource);
                this.getView().setModel(oJSONModel);
            },

            getGroupHeader: function (oGroup){            
                const groupHeaderListItem = new GroupHeaderListItem({
                    title: oGroup.key,
                    upperCase: true,
                    tooltip: oGroup.key
                });
                return groupHeaderListItem;

            },

            onShowSelectedItemsButtonPress: function() {
                const standardList = this.getView().byId("idProductsStdList");
                const selectedItems = standardList.getSelectedItems();
                const i18nModel = this.getView().getModel("i18n").getResourceBundle();
                const sMsgSelected = i18nModel.getText("selected");

                if (selectedItems.length > 0){
                    let text = "";
                    selectedItems.forEach( (item, index) => {
                        const context = item.getBindingContext();
                        const oContext = context.getObject();
                        text += `${index+1}. ${oContext.Material}\n`;
                    });
                    MessageToast.show(sMsgSelected + ":\n" + text.toUpperCase());                           
                }else{
                    MessageToast.show(i18nModel.getText("noSelection"));
                }
            },

            onProductsListSelectionChange: function() {
                const btnSelectedItems = this.getView().byId("idShowSelectedItemsButton");
                const selectedItemsCount = this.getView().byId("idProductsStdList").getSelectedItems().length;
                const oBundle = this.getView().getModel("i18n").getResourceBundle();
                const sMsg = oBundle.getText("btnSelectedItems", [selectedItemsCount]);

                btnSelectedItems.setProperty("text", sMsg);
            },
            
            onDeleteSelectedItemsButtonPress: function() {
                const standardList = this.getView().byId("idProductsStdList");
                const selectedItems = standardList.getSelectedItems();
                const btnSelectedItems = this.getView().byId("idShowSelectedItemsButton");
                const i18nModel = this.getView().getModel("i18n").getResourceBundle();
                const sMsgRemoved = i18nModel.getText("removed");
                const sMsgNoSelection = i18nModel.getText("noSelection");
                const oModel = this.getView().getModel();
                const products = oModel.getProperty("/Products");
                const arrId = [];
               
                if (selectedItems.length > 0) {
                    let text = "";
                    selectedItems.forEach((item, index) => {
                        const context = item.getBindingContext();
                        const oContext = context.getObject();
                        
                        arrId.push(oContext.Id);                     
                        text += `${index + 1}. ${oContext.Material}\n`;
                    });

                    const filteredProducts = products.filter((prod) => {
                        return !arrId.includes(prod.Id);
                    })

                    oModel.setProperty("/Products", filteredProducts);
                    standardList.removeSelections();                   
                    btnSelectedItems.setProperty("text", sMsgNoSelection);
                    MessageToast.show(sMsgRemoved + ":\n" + text.toUpperCase());  
                }else{
                    MessageToast.show(sMsgNoSelection);
                }
            }
            
        });
});