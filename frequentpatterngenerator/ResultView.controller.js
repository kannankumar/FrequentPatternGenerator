jQuery.sap.require("algorithms.apriori");
jQuery.sap.require("algorithms.bruteforce");
sap.ui.controller("frequentpatterngenerator.ResultView", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf frequentpatterngenerator.ResultView
*/
	onInit: function() {
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf frequentpatterngenerator.ResultView
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf frequentpatterngenerator.ResultView
*/
	onAfterRendering: function() {
		var result = {};  
		var MinsupValue = inputValues.minsup;
		var SelectedAlgoValue = inputValues.algorithm;
		//possibleItemSets = frequentpatterngenerator.algorithms.bruteforce.possibleItemSets();
		if (SelectedAlgoValue == "APRIORI") {
			this.getView().byId("resultViewPageHeading").setText("Result (using Apriori Algorithm)");
			var aprioriResult = frequentpatterngenerator.algorithms.apriori.getItemSets(inputValues.aMainArray, inputValues.minsup);
			result = aprioriResult.oItemSets;
			possibleItemSets= aprioriResult.oCandidatesBySupport;
			this.displayResultSet(MinsupValue, result);
			this.displayInputBinaryMatrix();
			this._displayFlowChart();
		} else if (SelectedAlgoValue == "BRUTE") {
			this.getView().byId("resultViewPageHeading").setText("Result (using Brute Force Algorithm)");
			frequentpatterngenerator.algorithms.bruteforce.getItemSets(inputValues.aMainArray);
			result = frequentpatterngenerator.algorithms.bruteforce.computeSupport(MinsupValue);
			possibleItemSets = frequentpatterngenerator.algorithms.bruteforce.possibleItemSets();
			this.displayResultSet(MinsupValue, result);
			this.displayInputBinaryMatrix();
			this._displayFlowChart();
		}
	},
	
	displayResultSet: function(MinsupValue, result) {
		var oController = this;
		var oIcontabbar = this.getView().byId("idIconTabBarFiori2");
		var oItem;
		var contentVBox;
		var contentVBox_HBox;
		
		oIcontabbar.destroyContent();
		oIcontabbar.destroyItems();
		
		for (var i = MinsupValue; i <= inputValues.transactions; i++) {
			if(result[i] != undefined)
			{
				oItem = new sap.m.IconTabFilter({
					showAll: true,
					count: i,
					iconColor: "Positive",
					key: i
				});
				contentVBox = new sap.m.VBox();
				oItem.addContent(contentVBox);
				contentVBox.addItem(new sap.m.Label({text: "Frequent item sets with Support - " + i}).addStyleClass("iconTabFilterHeading"));
				for(j=0;j<result[i].length;j++)
				{
					contentVBox_HBox = new sap.m.HBox({
						items: [
//						    new sap.m.Text({text: (j+1) + ". "}),
						    new sap.m.Label({text : result[i][j]}).addStyleClass("resultItemsLabel")
						]
					});
					contentVBox.addItem(contentVBox_HBox);
				}
				
				oIcontabbar.addItem(oItem);
			}
		}
		oController._displayPossibleItemSets();
	},
	
	_displayPossibleItemSets: function(){
		var oIcontabbar = this.getView().byId("idIconTabBarFiori2");
		oIcontabbar.setUpperCase(false);
		var oItem = new sap.m.IconTabFilter({
			showAll: true,
			text: "Possible Items"
//			count: 6,
//			iconColor: "Positive",
//			key: 6
		});
		var possibleItemsVBox = new sap.m.VBox();
		var possibleItemsVBox_HBox;
		possibleItemsVBox.addItem(new sap.m.Label({text: "All Possible Item Sets" }).addStyleClass("iconTabFilterHeading"));
		for(var i=0; i<=inputValues.transactions;i++){
			if(possibleItemSets[i] != undefined)
			{ 
				for(j=0;j<possibleItemSets[i].length;j++)
				{
					possibleItemsVBox_HBox = new sap.m.HBox({
						items: [
//						 
						    new sap.m.Label({text : possibleItemSets[i][j]+":"}).addStyleClass("resultItemsLabel"),
						    new sap.m.Label({text : i})
						]
					});
					possibleItemsVBox.addItem(possibleItemsVBox_HBox);
				}
			}
		}
		oItem.addContent(possibleItemsVBox);
		oIcontabbar.addItem(oItem);
	},
	displayInputBinaryMatrix: function(){
		var oIcontabbar = this.getView().byId("idIconTabBarFiori2");
		var i = oIcontabbar.getAggregation("items").length;
		oIcontabbar.setUpperCase(false);
		var oItem;
		var contentVBox;
		var contentVBox_HBox;
			oItem = new sap.m.IconTabFilter({
					showAll: true,
					text: "Input Binary Matrix"
				});
				contentVBox = new sap.m.VBox();
				oItem.addContent(contentVBox);
					contentVBox_HBox = new sap.m.HBox({
						items: [
//						    new sap.m.Text({text: (j+1) + ". "}),
						    new sap.m.Table({id :"results.inputMatrix"})
						]
					});
					
					
						var cells = [
			new sap.m.Input({
				value: "{colA}"
			})
		];

		var oTemplate = new sap.m.ColumnListItem({
			cells: cells
		});
					
				contentVBox.addItem(contentVBox_HBox);
				//oItem.addContent(contentVBox);
				oIcontabbar.addItem(oItem);
				this.fnCreateTableTemplate(inputValues.transactions,"results.inputMatrix",oTemplate,inputValues.items);
				
				
	},
	
		fnCreateTableTemplate: function(noOfTransactions, oTable,oTemplate, noOfItems) {
		var that = this;
		var table = sap.ui.getCore().byId(oTable);
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
				oRow.addCell(new sap.m.Text({
				text: i
			}));
			}
			table.addItem(oRow);
		}
		
		
		var rowCount = table.getItems().length;
		var cellCount = table.getItems()[0].getCells().length;

		for (var j = 0; j < rowCount; j++) {
			for (var i = 1; i < cellCount; i++) {
				table.getItems()[j].getCells()[i].setText(inputValues.aMainArray[j][i-1]);				
			}
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
	_displayFlowChart:function(){
		var oIcontabbar = this.getView().byId("idIconTabBarFiori2");
		oIcontabbar.setUpperCase(false);
		var oItem = new sap.m.IconTabFilter({
			showAll: true,
			text: "Flow Chart"

		});
		var flowChartVBox = new sap.m.VBox({
			items:[
			       new sap.m.Image({
			    	   src: "./images/FlowChart.PNG"
			       })
			       ]
		});
		oItem.addContent(flowChartVBox);
		oIcontabbar.addItem(oItem);
	},
	handleBackBtnClick: function() {
		var oIcontabbar = this.getView().byId("idIconTabBarFiori2");
		oIcontabbar.destroyContent();
		oIcontabbar.destroyItems();

		app.back("idMainView1");
	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf frequentpatterngenerator.ResultView
*/
//	onExit: function() {
//
//	}

});