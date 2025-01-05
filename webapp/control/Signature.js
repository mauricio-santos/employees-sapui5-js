sap.ui.define([
	"sap/ui/core/Control"
],
	/**
	 * @param {typeof sap.ui.core.Control} Control 
	 */
	function (Control) {
		"use strict";

		return Control.extend("logaligroup.employees.control.Signature", {

			metadata: {
				properties: {
					"width": {
						type: "sap.ui.core.CSSSize",
						defaultValue: "400px"
					},
					"height": {
						type: "sap.ui.core.CSSSize",
						defaultValue: "100px"
					},
					"background-color": {
						type: "sap.ui.core.CSSColor",
						defaultValue: "white"
					}
				}
			},

			onInit: function () {

			},

			renderer: function(oRM, oControl) {
				oRM.write("<div");
				oRM.addStyle("width", oControl.getProperty("width"));
				oRM.addStyle("height", oControl.getProperty("height"));
				oRM.addStyle("background-color", oControl.getProperty("background-color"));
				oRM.addStyle("border", "1px solid black");
				oRM.writeStyles();
				oRM.write(">");

				oRM.write(`<canvas width="${oControl.getProperty("width")}" height="${oControl.getProperty("height")}"/>`);
				oRM.write("</div>")
			},

			onAfterRendering: function() {
				try{
					const canvas = document.querySelector("canvas");
					this.signaturePad = new SignaturePad(canvas);
					this.signaturePad.fill = false;
					canvas.addEventListener("mousedown", () => this.signaturePad.fill = true);
				}catch(e) {
					console.log(e);
				}
			},

			clear: function() {
				this.signaturePad.clear();
			},

			isFill: function() {
				return this.signaturePad.fill;
			},

			getSignature: function() {
				return this.signaturePad.toDataURL(); //devolve a imagem em PNG
			},

			setSignature: function(signaturePNG) {
				this.signaturePad.fronDataURL(signaturePNG);
			}
		});
	});