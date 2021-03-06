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

        var minSup = [{
            "key": "1",
            "text": "1"
        }];
        var minsupModel = new sap.ui.model.json.JSONModel({
            minSupKeys: minSup
        });
        sap.ui.getCore().setModel(minsupModel, "minsupKey");

        this.getView().byId('idMinsup').setModel('minsupKey');
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

    setMinsup: function() {
        var noOfTransactions = this.getView().byId("idTransactions").getSelectedKey();
        var minSup = [];

        for (var i = 0; i < noOfTransactions; i++) {
            minSup[i] = {};
            minSup[i].key = i + 1;
            minSup[i].text = i + 1;
        }

        var minsupModel = new sap.ui.model.json.JSONModel({
            minSupKeys: minSup
        });
        sap.ui.getCore().setModel(minsupModel, "minsupKey");

        this.getView().byId('idMinsup').setModel('minsupKey');
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
                    width: "35px",
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
    	if(this.isValidInputTable()){
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
	    }
    },
    isValidInputTable: function() {
        var table = sap.ui.getCore().byId("oTable");
        if(table){
	        var rowCount = table.getItems().length;
	        var cellCount = table.getItems()[0].getCells().length;
	        var flag = 0;
	        for (var j = 0; j < rowCount; j++) {
	            for (var i = 1; i < cellCount; i++) {
	                var val = table.getItems()[j].getCells()[i].getValue();
	                if (val == "") {
	                    flag = 1;
	                    break;
	                    //sap.m.MessageToast.show("Fill in all the entries");
	                }
	            }
	            if (flag) break;
	        }
	        
	    }
	    else{
	    	flag = 1;
	    }
	    if(flag){ 
        	this.handleGeneratePress();
        	sap.m.MessageToast.show("Fill in the entries in input Table");
        	return false;
        }
        else{
        	return true;
        }
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
    onPressDialogAutoGenerate: function(oEvent) {
        var table = sap.ui.getCore().byId("oTable");
        var rowCount = table.getItems().length;
        var cellCount = table.getItems()[0].getCells().length;

        for (var j = 0; j < rowCount; j++) {
            for (var i = 1; i < cellCount; i++) {
                var randomVal = Math.random() < 0.5 ? 0 : 1;
                table.getItems()[j].getCells()[i].setValue(randomVal);
            }
        }
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
                if (val == "") {
                    flag = 1;
                    sap.m.MessageToast.show("Fill in all the entries");

                }
                tempArray.push(parseInt(val));
            }
            inputValues.aMainArray.push(tempArray);
        }
        //		console.log(inputValues.aMainArray);
        if (flag == 0) {
            thatFrag.fragment.close();
        }
    },

    onPressDialogCancel: function(oEvent) {
        thatFrag.fragment.close();
    }
});
