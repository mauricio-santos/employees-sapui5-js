sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "logaligroup/employees/model/formatter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller 
     * @param {typeof sap.ui.core.Fragment} Fragment 
     */
    function (Controller, Fragment, formatter) {
        "use strict";

        function onInit() {
            
        };

        function onCreateIncidenceButtonPress() {
            const tableIncidence = this.getView().byId("idTableIncidencePanel");
            const incidenceModel = this.getView().getModel("incidenceModel");
            const oData = incidenceModel.getData();
            let oDataLength = oData.length;
            let fragRandomId = 'fragID' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);

            //Adicionando index da incidencia no oData
            oData.push({
                index: oDataLength + 1,
            });

            //Atualizando o modelo
            incidenceModel.refresh();

            //Instanciando Fragmento
            Fragment.load({
                name: "logaligroup.employees.fragments.NewIncidence",
                id: fragRandomId,
                controller: this //Se o controller não for passado, a função dataFormat não executará
            }).then(function (frag) {
                frag.bindElement({
                    model: "incidenceModel",
                    path: "/" + oDataLength
                });
                tableIncidence.addContent(frag);
            })
        };

        function onIconDeletePress(event) {                     
            const incidenceModel = this.getView().getModel("incidenceModel");
            let oData = incidenceModel.getData();
            let fragmentInstance = event.getSource().getParent().getParent(); // O avô do evento
            const oBindingContext = fragmentInstance.getBindingContext("incidenceModel");
            const tableIncidence = this.getView().byId("idTableIncidencePanel");
            const contextObj = oBindingContext.getObject()

            //Removendo elemento do modelo
            oData.splice(contextObj.index - 1, 1);
        
            // Reordenando os índices do modelo
            oData.forEach((oIncidence, i) => {
                oIncidence.index = i + 1;          
            });

            //Atualizando o modelo
            incidenceModel.refresh();

            //Removendo o conteúdo da view
            tableIncidence.removeContent(fragmentInstance);

            // Destruindo o fragmento para liberar memória
            fragmentInstance.destroy();
           
            // Realizando o binding na tabela
            tableIncidence.getContent().forEach((row, index) => {
                row.bindElement("incidenceModel>/" + index)
            });  
        };

        function onSaveButtonPress(event) {
            const fragmentInstance = event.getSource().getParent().getParent(); // O avô do evento
            const oBindingContext = fragmentInstance.getBindingContext("incidenceModel");
            const incidenceIndex = oBindingContext.sPath.replace("/", '');
            
            //Instanciando o EventBus
            const oEventBus = sap.ui.getCore().getEventBus();
            //Publicando evento
            oEventBus.publish("IncidenceChanel", "SelectedIncidenceIndex", {index: incidenceIndex});
        }

        const EmployeeDetails = Controller.extend("logaligroup.employees.controller.EmployeeDetails", {});
        EmployeeDetails.prototype.onInit = onInit;
        EmployeeDetails.prototype.onCreateIncidenceButtonPress = onCreateIncidenceButtonPress;
        EmployeeDetails.prototype.Formatter = formatter;
        EmployeeDetails.prototype.onIconDeletePress = onIconDeletePress;
        EmployeeDetails.prototype.onSaveButtonPress = onSaveButtonPress;
        return EmployeeDetails;
    }
);