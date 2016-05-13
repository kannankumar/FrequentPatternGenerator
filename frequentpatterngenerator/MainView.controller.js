sap.ui.controller("frequentpatterngenerator.MainView", {
	onInit: function() {
		inputValues = {};
		inputValues.items = "";
		inputValues.transactions = "";
		inputValues.minsup = "";
		inputValues.algorithm = "";
		inputValues.aMainArray = [];
//		this.aMainArray = [];
		this.oData = [{
			colA: ""
		}];
		thatFrag = this;
	},

	handleGeneratePress: function() {
		if (!thatFrag.fragment) {
			thatFrag.fragment = sap.ui.xmlfragment("frequentpatterngenerator.ItemSetTable", this);
		}
		thatFrag.fragment.open();

		var noOfTransactions = this.getView().byId("idTransactions").getSelectedKey();
		var noOfItems = this.getView().byId("idItems").getSelectedKey();
		var cells = [
			new sap.m.Input({
				value: "{colA}"
			})
		];

		var oTemplate = new sap.m.ColumnListItem({
			cells: cells
		});

		this.fnCreateTableTemplate(noOfTransactions, oTable, oTemplate, noOfItems);
	},
	
	fnCreateTableTemplate: function(noOfTransactions, oTable, oTemplate, noOfItems) {
		var that = this;
		var table = sap.ui.getCore().byId("oTable");
		var getInputValColumn = noOfItems;
		var getInputValRow = noOfTransactions;

		table.destroyColumns();
		table.destroyItems();
		table.addColumn(
			new sap.m.Column({
				header: new sap.m.Label({
					text: "Transactions/Items"
				})
			})
		);
		for (var i = 0; i < getInputValColumn; i++) {
			table.addColumn(that.fnReturnColumn(i));
		}

		for (var i = 1; i <= getInputValRow; i++) {
			var oRow = new sap.m.ColumnListItem({
				cells: []
			});
			oRow.addCell(new sap.m.Text({
				text: i
			}));
			for (var j = 0; j < getInputValColumn; j++) {
				oRow.addCell(new sap.m.Input({
					width: "25%",
					valueStateText: "Enter the value as 0 or 1",
					liveChange: function(oEvent) {
						var liveValue = oEvent.getSource().getValue();
						if (liveValue !== "0") {
							if (liveValue !== "1") {
								oEvent.getSource().setValue("");
							}
						}
					}
				}));
			}
			table.addItem(oRow);
		}
	},
	
	handleGenerateSubmit: function() {
		var MinsupValue = this.getView().byId("idMinsup").getSelectedKey();
		var SelectedAlgoValue = this.getView().byId("idAlgorithm").getSelectedKey();
		
		inputValues.items = this.getView().byId("idItems").getSelectedKey();
		inputValues.transactions = this.getView().byId("idTransactions").getSelectedKey();
		inputValues.minsup = MinsupValue;
		inputValues.algorithm = SelectedAlgoValue;
		
		if (inputValues.algorithm === "APRIORI") {
			
		} else if (inputValues.algorithm === "BRUTE") {
			
		}
		app.to("idResultView");
		sap.ui.getCore().byId("idResultView").onAfterRendering();
	},
	
	fnReturnColumn: function(i) {
		if (i == 0) {
			i = "A";
		} else if (i == 1) {
			i = "B";
		} else if (i == 2) {
			i = "C";
		} else if (i == 3) {
			i = "D";
		} else if (i == 4) {
			i = "E";
		} else if (i == 5) {
			i = "F";
		} else if (i == 6) {
			i = "G";
		} else if (i == 7) {
			i = "H";
		} else if (i == 8) {
			i = "I";
		} else if (i == 9) {
			i = "J";
		}
		return new sap.m.Column().setHeader(new sap.m.Text({
			text: i
		}));
	},
	
	onPressDialogOk: function(oEvent) {
		var table = sap.ui.getCore().byId("oTable");
		var rowCount = table.getItems().length;
		var cellCount = table.getItems()[0].getCells().length;
		var tempArray = [];
		var flag = 0;
		//var MessageToast = new sap.m.MessageToast();
		inputValues.aMainArray = [];
		for (var j = 0; j < rowCount; j++) {
			tempArray = [];
			for (var i = 1; i < cellCount; i++) {
				var val = table.getItems()[j].getCells()[i].getValue();
				if(val == "")
					{
					 flag = 1;
					 sap.m.MessageToast.show("Fill in all the entries");
					 
					}
				tempArray.push(parseInt(val));
			}
			inputValues.aMainArray.push(tempArray);
		}
//		console.log(inputValues.aMainArray);
		if(flag == 0)
		{
			thatFrag.fragment.close();
		}
	},
	
	onPressDialogCancel: function(oEvent) {
		thatFrag.fragment.close();
	}
});