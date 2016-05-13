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
		
		if (SelectedAlgoValue == "APRIORI") {
			this.getView().byId("resultViewPageHeading").setText("Result (using Apriori Algorithm)");
			result = frequentpatterngenerator.algorithms.apriori.getItemSets(inputValues.aMainArray, inputValues.minsup);
			this.displayResultSet(MinsupValue, result);
		} else if (SelectedAlgoValue == "BRUTE") {
			this.getView().byId("resultViewPageHeading").setText("Result (using Brute Force Algorithm)");
			frequentpatterngenerator.algorithms.bruteforce.getItemSets(inputValues.aMainArray);
			result = frequentpatterngenerator.algorithms.bruteforce.computeSupport(MinsupValue);
			this.displayResultSet(MinsupValue, result);
		}
	},
	
	displayResultSet: function(MinsupValue, result) {
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