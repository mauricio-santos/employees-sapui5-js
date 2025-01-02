sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller 
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel 
     * @param {typeof sap.ui.model.Filter} Filter 
     * @param {typeof sap.ui.model.FilterOperator} FilterOperator 
     * @param {typeof sap.ui.core.Fragment} Fragment 
     * @param {typeof sap.m.MessageBox} MessageBox 
     */
    function (Controller, JSONModel, Filter, FilterOperator, Fragment, MessageBox) {
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

                //inscrevendo-se ao Canal IncidenceChanel do evento SelectedIncidenceIndex
                oEventBus.subscribe("IncidenceChanel", "SelectedIncidenceIndex", this.createIncidence, this)

                //inscrevendo-se ao Canal IncidenceChanel do evento DeleteIncidence
                oEventBus.subscribe("IncidenceChanel", "DeleteIncidence", this.deleteIncidence, this)
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

                // Lendo as incidências
                this.readIncidences.bind(this)(this._employeeDetailsView.getBindingContext("northwindModel").getObject().EmployeeID);      
            },

            createIncidence: function (sChanel, sEvent, oData) {
                const aIncidencesModel = this._employeeDetailsView.getModel("incidenceModel").getData();
                const oIncidence = aIncidencesModel[oData.index];
                const oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                const employeeID = this._employeeDetailsView.getBindingContext("northwindModel").getObject().EmployeeID.toString()
                const sapId = this.getOwnerComponent().SapId
                const oModel = this.getView().getModel("incidenceModel");

                if (oIncidence.IncidenceId == undefined) {
                    // ###### CREATE ######
                    const body = {
                        SapId: sapId,
                        EmployeeId: employeeID,
                        CreationDate: oIncidence.CreationDate,
                        Type: oIncidence.Type,
                        Reason: oIncidence.Reason
                    }

                    //save on SAP
                    oModel.create("/IncidentsSet", body, {
                        success: function () {
                            this.readIncidences.bind(this)(employeeID)
                            // sap.m.MessageToast.show(oResourceBundle.getText("oDataOK"))
                            MessageBox.success(oResourceBundle.getText("oDataOK"));
                        }.bind(this),
                        error: function (e) {
                            
                            // sap.m.MessageToast.show(oResourceBundle.getText("oDataERROR"))
                            MessageBox.error(oResourceBundle.getText("oDataERROR"));
                            console.warn(e);
                        }.bind(this)
                    })

                    
                    // ###### UPDATE ######
                } else if (oIncidence.CreationDateX || oIncidence.ReasonX || oIncidence.TypeX){
                    const body = {
                        CreationDate: oIncidence.CreationDate,
                        CreationDateX: oIncidence.CreationDateX,
                        Type: oIncidence.Type,
                        TypeX: oIncidence.TypeX,
                        Reason: oIncidence.Reason,
                        ReasonX: oIncidence.ReasonX
                    };

                    const sPath = `/IncidentsSet(IncidenceId='${oIncidence.IncidenceId}',SapId='${oIncidence.SapId}',EmployeeId='${oIncidence.EmployeeId}')`;
                    oModel.update(sPath, body, {
                        success: function() {
                            this.readIncidences.bind(this)(employeeID)
                            sap.m.MessageToast.show(oResourceBundle.getText("oDataUpdateOK"));
                        }.bind(this),
                        error: function (e) {
                            sap.m.MessageToast.show(oResourceBundle.getText("oDataUpdateERROR"));
                            console.warn(e);
                        }.bind(this)
                    })
                }else {
                    sap.m.MessageToast.show(oResourceBundle.getText("oDataNoChanges"));
                }
            },

            readIncidences: function (employeeID) {
                const oModel = this.getView().getModel("incidenceModel");
                const sapID = this.getOwnerComponent().SapId;
                
                // READ
                oModel.read("/IncidentsSet", {
                    filters: [
                        new Filter("SapId", FilterOperator.EQ, sapID),
                        new Filter("EmployeeId", FilterOperator.EQ, employeeID)
                    ],
                    success: function (incidentsSetResult) {

                        //Atualizado o modelo
                        const incidenceModel = this._employeeDetailsView.getModel("incidenceModel");
                        const dataUpdated = incidentsSetResult.results;
                        incidenceModel.setData(dataUpdated);

                        //Removendo todo o conteúdo da tabela
                        const tableIncidence = this._employeeDetailsView.byId("idTableIncidencePanel");
                        tableIncidence.removeAllContent();

                        //Iterando fragmento
                        const fragId = 'fragID' + Date.now();
                        dataUpdated.forEach((incidence, index) => {
                            incidence.validateDate = true;
                            incidence.enabledSave = false;
                            
                            Fragment.load({
                                name: "logaligroup.employees.fragments.NewIncidence",
                                id: fragId + index,
                                controller: this._employeeDetailsView.getController()
                            })
                            .then(frag => {
                                //Aqui, o fragmento é adicionado como dependente da View _employeeDetailsView, garantindo que o fragmento seja destruído corretamente quando a View principal for destruída.
                                this._employeeDetailsView.addDependent(frag);

                                //Realizando o binding dos elementos
                                // frag.bindElement("incidenceModel>/" + index);
                                frag.bindElement({
                                    path: "/" + index,
                                    model: "incidenceModel"
                                });

                                //o fragmento carregado é adicionado como conteúdo ao contêiner tableIncidence.
                                tableIncidence.addContent(frag);
                                
                                // console.log("Binding aplicado ao fragmento:", frag.getBindingContext("incidenceModel"));
                            })
                            .catch(function (e) {
                                console.error(e);
                            });
                        });
                    }.bind(this),
                    error: function (e) {
                        console.log(e);
                    }
                });
            },

            deleteIncidence: function (sChanel, sEvent, oData) {
                const oModel = this.getView().getModel("incidenceModel");
                const oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                
                const sPath = `/IncidentsSet(IncidenceId='${oData.IncidenceId}',SapId='${oData.SapId}',EmployeeId='${oData.EmployeeId}')`;

                oModel.remove(sPath, {
                    success: function () {
                        this.readIncidences.bind(this)(oData.EmployeeId)               
                        sap.m.MessageToast.show(oResourceBundle.getText("oDataDeleteOK", [parseInt(oData.IncidenceId)]));
                    }.bind(this),
                    error: function (e) {
                        sap.m.MessageToast.show(oResourceBundle.getText("oDataDeleteERROR"));
                        console.warn(e);
                    }.bind(this)
                });
            }
        });
    });