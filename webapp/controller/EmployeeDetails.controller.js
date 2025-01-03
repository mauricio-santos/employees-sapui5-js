sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "logaligroup/employees/model/formatter",
    "sap/m/MessageBox",
    "sap/ui/core/UIComponent"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller 
     * @param {typeof sap.ui.core.Fragment} Fragment 
     * @param {typeof sap.m.MessageBox} MessageBox 
     * @param {typeof sap.ui.core.UIComponent} UIComponent 
     */
    function (Controller, Fragment, formatter, MessageBox, UIComponent) {
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
                validateDate: false,
                enabledSave: false
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
            const oBindingContext = event.getSource().getBindingContext("incidenceModel");
            const oContext = oBindingContext.getObject();
            const resourceBundle = this.getView().getModel("i18n").getResourceBundle();

            MessageBox.confirm(resourceBundle.getText("confirmDeleteIncidence", [parseInt(oContext.IncidenceId)]), {
                onClose: function (oAction) {
                    console.log(oAction);
                    
                    if (oAction === "OK") {
                        console.log("----OK");
                        
                        const oEventBus = sap.ui.getCore().getEventBus();
                        oEventBus.publish("IncidenceChanel", "DeleteIncidence", oContext);
                    }
                }.bind(this)
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
        };

        function onDatePickerChange(event) {
            const bindingContext = event.getSource().getBindingContext("incidenceModel");
            const oContext = bindingContext.getObject();
            const isValidDate = event.getSource().isValidValue() //A função isValidDate é do controle DataPicker
            const resourceBundle = this.getView().getModel("i18n").getResourceBundle();
            
            if (!isValidDate){
                oContext.validateDate = false;
                oContext.CreationDateState = "Error";

                MessageBox.error(resourceBundle.getText("errorCreationDateValue"), {
                    title: "Error",
                    onclose: null,
                    styleClass: null,
                    actions: MessageBox.Action.CLOSE,
                    emphasizedAction: null,
                    initial: null,
                    textDirection: sap.ui.core.TextDirection.Inherit
                });
            }else{
                oContext.CreationDateX = true;
                oContext.validateDate = true;
                oContext.CreationDateState = "None";
            }

            (isValidDate && oContext.CreationDate && oContext.Reason) ? oContext.enabledSave = true : oContext.enabledSave = false;

            //Atualizando o modelo com os novos valores
            bindingContext.getModel().refresh()
            
        };

        function onReasonInputChange(event) {
            const bindingContext = event.getSource().getBindingContext("incidenceModel");
            const oContext = bindingContext.getObject();
            const isValue = event.getSource().getValue()
            
            if (!isValue) {
                oContext.CreationReasonState = "Error";
            } else {
                oContext.ReasonX = true;
                oContext.CreationReasonState = "None";
            }

            (isValue && oContext.validateDate) ? oContext.enabledSave = true : oContext.enabledSave = false;
        
            //Atualizando o modelo com os novos valores
            bindingContext.getModel().refresh()
        };

        function onSelectTypeChange(event) {
            const bindingContext = event.getSource().getBindingContext("incidenceModel");
            const oContext = bindingContext.getObject();
            oContext.TypeX = true;

            (oContext.validateDate && oContext.Reason) ? oContext.enabledSave = true : oContext.enabledSave = false;

            //Atualizando o modelo com os novos valores
            bindingContext.getModel().refresh()

        };

        function onColumnListItemOrderPress(event) {
            const orderID = event.getSource().getBindingContext("northwindModel").getObject().OrderID;
            const oRouter = UIComponent.getRouterFor(this);
            oRouter.navTo("RouteOrderDetails", { orderID })
        };

        const EmployeeDetails = Controller.extend("logaligroup.employees.controller.EmployeeDetails", {});
        EmployeeDetails.prototype.onInit = onInit;
        EmployeeDetails.prototype.onCreateIncidenceButtonPress = onCreateIncidenceButtonPress;
        EmployeeDetails.prototype.Formatter = formatter;
        EmployeeDetails.prototype.onIconDeletePress = onIconDeletePress;
        EmployeeDetails.prototype.onSaveButtonPress = onSaveButtonPress;
        EmployeeDetails.prototype.onDatePickerChange = onDatePickerChange;
        EmployeeDetails.prototype.onReasonInputChange = onReasonInputChange;
        EmployeeDetails.prototype.onSelectTypeChange = onSelectTypeChange;
        EmployeeDetails.prototype.onColumnListItemOrderPress = onColumnListItemOrderPress;
        return EmployeeDetails;
    }
);