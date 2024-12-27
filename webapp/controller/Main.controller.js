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

        return Controller.extend("logaligroup.employees.controller.Main", {

            onBeforeRendering: function() {
                this._employeeDetailsView = this.getView().byId("idEmployeeDatailsXMLView");
            },

            onInit: function () {
                const oView = this.getView();

                const employeesModel = new JSONModel();
                employeesModel.loadData("./localService/mockdata/Employees.json");
                oView.setModel(employeesModel, "employeesModel");

                const countriesModel = new JSONModel();
                countriesModel.loadData("./localService/mockdata/Countries.json");
                oView.setModel(countriesModel, "countriesModel");

                const configModel = new JSONModel({
                    visibleId: true,
                    visibleName: true,
                    visibleCountry: true,
                    visibleCity: false,
                    visibleBtnShowCity: true,
                    visibleBtnHideCity: false
                });
                oView.setModel(configModel, "configModel");

                const layoutModel = new JSONModel();
                layoutModel.loadData("./localService/mockdata/Layout.json");
                oView.setModel(layoutModel, "layoutModel");

                //Obtendo o Event Bus
                const oEventBus = sap.ui.getCore().getEventBus();
                //inscrevendo-se ao Canal EmployeeChanel do evento EmployeeSelected
                oEventBus.subscribe("EmployeeChanel", "SelectedEmployee", this.employeeSelected, this);

                //inscrevendo-se ao Canal EmployeeChanel do evento EmployeeSelected
                oEventBus.subscribe("IncidenceChanel", "SelectedIncidenceIndex", this.createIncidence, this)
            },

            employeeSelected: function (sChanel, sEvent, oData) {
                const detailsView = this.getView().byId("idEmployeeDatailsXMLView");
                const pathEmployee = oData.getPath();
                
                detailsView.bindElement("northwindModel>" + pathEmployee);
                this.getView().getModel("layoutModel").setProperty("/ActiveKey", "TwoColumnsMidExpanded");

                //Criando modelo para incidências
                const incidenceModel = new JSONModel([]);
                detailsView.setModel(incidenceModel, "incidenceModel");
                
                // Limpando incidências ao clicar em outro ítem
                detailsView.byId("idTableIncidencePanel").removeAllContent();
            },

            createIncidence: function (sChanel, sEvent, oData) {
                const aIncidencesModel = this._employeeDetailsView.getModel("incidenceModel").getData();
                const oIncidence = aIncidencesModel[oData.index];
                const oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
            
                if (oIncidence.IncidenceId == undefined){
                    // ###### CREATE ######
                    const body = {
                        SapId: this.getOwnerComponent().SapId,
                        EmployeeId: this._employeeDetailsView.getBindingContext("northwindModel").getObject().EmployeeID.toString(),
                        CreationDate: oIncidence.CreationDate,
                        Type: oIncidence.Type,
                        Reason: oIncidence.Reason
                    }

                    //save on SAP
                    this.getView().getModel("incidenceModel").create("/IncidentsSet", body, {
                        success: function () {
                            sap.m.MessageToast.show(oResourceBundle.getText("oDataOK"))
                        }.bind(this),
                        error: function (e) {
                            sap.m.MessageToast.show(oResourceBundle.getText("oDataERROR"))
                            console.warn(e);
                        }.bind(this)
                    })
                    
                }else {
                    sap.m.MessageToast.show(oResourceBundle.getText("oDataNoChanges"))
                }
            }
        });
    });