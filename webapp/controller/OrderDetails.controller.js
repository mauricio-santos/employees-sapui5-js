sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent",
    "sap/m/ObjectListItem",
    "sap/m/CustomListItem",
    "sap/m/Label",
    "sap/m/Bar",
    "sap/m/ObjectStatus",
    "sap/m/MessageBox",
    "sap/ui/core/Item",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/upload/UploadSetItem"
], 
/**
 * @param {typeof sap.ui.core.mvc.Controller} Controller 
 * @param {typeof sap.ui.core.routing.History} History 
 * @param {typeof sap.ui.core.UIComponent} UIComponent 
 * @param {typeof sap.m.ObjectListItem} ObjectListItem 
 * @param {typeof sap.m.CustomListItem} CustomListItem 
 * @param {typeof sap.m.Label} Label 
 * @param {typeof sap.m.Bar} Bar 
 * @param {typeof sap.m.ObjectStatus} ObjectStatus 
 * @param {typeof sap.m.MessageBox} MessageBox 
 * @param {typeof sap.ui.core.Item} Item 
 * @param {typeof sap.ui.model.Filter} Filter 
 * @param {typeof sap.ui.model.FilterOperator} FilterOperator 
 * @param {typeof sap.m.upload.UploadSetItem} UploadSetItem 
 */
    function (Controller, History, UIComponent, ObjectListItem, CustomListItem, Label, Bar, ObjectStatus, MessageBox, Item, Filter, FilterOperator, UploadSetItem) {
    "use strict";

        function _onObjectMatched(event) {
            const orderID = event.getParameter("arguments").orderID;
            const path = `/Orders(${orderID})`;
            const model = this.getView().getModel("northwindModel");
            const oContext = model.getContext(path);
            
            //Remove previus signature
            this.onClearSignatureButtonPress();
                        
            //Binding model and read signature
            this.getView().bindElement({
                path,
                model: "northwindModel",
                events: { 
                    //READ Signature - Access direct from OrderDetails. Model will be loaded. 
                    dataReceived: function (oData) {
                        // READ Signature
                        const oOrder = oData.getParameters().data;
                        oOrder.SapId = this.getOwnerComponent().SapId;
                        _readDependences.bind(this)(oOrder);
                    }.bind(this)
                }
            });

            //READ Signature - access from EmployeeDetails. Model is loaded.
            const oOrder = oContext.getObject();
            if (oOrder) {     
                oOrder.SapId = this.getOwnerComponent().SapId;
                _readDependences.bind(this)(oOrder);
            }
            
        };

        function _readDependences(oOrder) {
            // ### READ SIGNATURE IMAGE ###
            const oModel = this.getView().getModel("incidenceModel");
            const sQuery = `/SignatureSet(OrderId='${oOrder.OrderID}',SapId='${oOrder.SapId}',EmployeeId='${oOrder.EmployeeID}')`;
 
            oModel.read(sQuery, {
                success: function (data) {
                    const base64 = "data:image/png;base64," + data.MediaContent;
                    const signature = this.getView().byId("idSignature");
                    base64 && signature.setSignature(base64);
                }.bind(this),
                error: function (e) {
                    console.warn(e.message);
                }
            });

            // ### READ UPLOAD FILES ###
            //Bind Files using UploadSet
            const oBindingInfo = {
                path: "incidenceModel>/FilesSet",
                filters: [
                    new Filter("OrderId", FilterOperator.EQ, oOrder.OrderID),
                    new Filter("SapId", FilterOperator.EQ, oOrder.SapId),
                    new Filter("EmployeeId", FilterOperator.EQ, oOrder.EmployeeID),
                ],
                template: new UploadSetItem("", {
                    fileName: "{incidenceModel>FileName}",
                    visibleEdit: false,
                    url: { //Download URL
                        path: "incidenceModel>__metadata/media_src", // Full URL for media_src
                        formatter: function (sMediaSrc) {
                            // Removes the hostname and returns only the relative part
                            const sRelativePath = sMediaSrc.replace(/^https?:\/\/[^/]+/, "");
                            return sRelativePath;
                        }
                    }
                })
            };

            const oUploadSet = this.byId("idItemsUploadSet");
            oUploadSet.bindAggregation("items", oBindingInfo); //Binding to the UploadSet control
        };

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
            try {
                const signature = this.byId("idSignature");
                signature.clear()
            }catch (e) {
                console.log(e);
            }
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
        },

        onUploadSetAfterItemAdded: function (event) {
            const oItem = event.getParameter("item");
            const csrfToken = this.getView().getModel("incidenceModel").getSecurityToken();

            const oCsrfHeader = new Item({
                key: "x-csrf-token",
                text: csrfToken
            });

            // Add header to upload item
            oItem.addHeaderField(oCsrfHeader);
        },

        onUploadSetBeforeUploadStarts: function (event) {
            //Get the item from upload
            const oItem = event.getParameter("item");
            const fileName = oItem.getFileName();

            // Get the context and values ​​for the slug
            const oContext = event.getSource().getBindingContext("northwindModel");
            const oOrder = oContext.getObject();
            const sapId = this.getOwnerComponent().SapId;

            // Build slug value
            const sSlug = `${oOrder.OrderID};${sapId};${oOrder.EmployeeID};${fileName}`;
            const encodedSlugValue = encodeURIComponent(sSlug);

            // Create the custom header parameter
            const oHeaderFieldSlug = new Item({
                key: "slug",
                text: encodedSlugValue
            });

            // Add header to upload item
            oItem.addHeaderField(oHeaderFieldSlug);

            // console.log("Headers added to item:", oItem.getHeaderFields());
        },

        onUploadSetUploadCompleted: function(event) {
            event.getSource().getBinding("items").refresh(); //Now the file is ready for download
        },

        onUploadSetAfterItemRemoved: function(event) {
            const oContext = event.getParameter("item").getBindingContext("incidenceModel");
            const path = oContext.getPath();
            const oModel = oContext.getModel();

            oModel.remove(path, {
                success: function() {

                },
                error: function(e) {
                    console.log(e.message);
                }
            })
            
        }
    });
});