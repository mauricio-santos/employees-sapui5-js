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
                let standardList = this.getView().byId("idProductsStdList");
                let selectItems = standardList.getSelectedItems();
                const i18nModel = this.getView().getModel("i18n").getResourceBundle();

                if (selectItems.length > 0){
                    let text = "";
                    selectItems.forEach( (item, index) => {
                        const context = item.getBindingContext();
                        const oContext = context.getObject();
                        text += `${index+1}. ${oContext.Material}\n`;

                        MessageToast.show(text.toUpperCase());
                    })                                     
                }else{
                    MessageToast.show(i18nModel.getText("noSelection"))
                }
            }


        });
});