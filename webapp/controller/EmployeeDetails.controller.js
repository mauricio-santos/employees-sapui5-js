sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller 
     * @param {typeof sap.ui.core.Fragment} Fragment 
     */
    function (Controller, Fragment) {
        "use strict";

        function onInit() {

        };

        function onCreateIncidenceButtonPress() {
            const tableIncidence = this.getView().byId("idTableIncidencePanel");
            const incidenceModel = this.getView().getModel("incidenceModel");
            const oData = incidenceModel.getData();
            const lastIndex = oData.length;
            
            oData.push({ index: lastIndex + 1 });
            incidenceModel.refresh();
            
            this._newIncidence = Fragment.load({
                name: "logaligroup.employees.fragments.NewIncidence",
                id: "fragIncidencesId" + lastIndex
            })
            this._newIncidence.then(function (frag) {
                frag.bindElement({
                    model: "incidenceModel",
                    path: "incidenceModel>/" + lastIndex
                });
                tableIncidence.addContent(frag);
            })            
        };

        const EmployeeDetails = Controller.extend("logaligroup.employees.controller.EmployeeDetails", {});
        EmployeeDetails.prototype.onInit = onInit;
        EmployeeDetails.prototype.onCreateIncidenceButtonPress = onCreateIncidenceButtonPress;
        return EmployeeDetails;
    }
);