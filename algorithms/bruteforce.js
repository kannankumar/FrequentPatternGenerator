jQuery.sap.declare("frequentpatterngenerator.algorithms.bruteforce");

frequentpatterngenerator.algorithms.bruteforce = {
		aCombi: [],
		aData: [],
		ItemsetSupportData: {},
		max: null,
		bruteRes: {},
        itm: null,
		getItemSets : function(items) {

			var possible_items = [ "A", "B", "C", "D", "E", "F",
					"G", "H", "I", "J", "K", "L", "M", "N", "O",
					"P", "Q", "R", "S", "T", "U", "V", "W", "X",
					"Y", "Z" ];

			/*
			 * Generate the given itemset from the matrix
			 */
			this.aData = [];
			for (var row = 0; row < items.length; ++row) {
				var str = "";
				for (itm = 0; itm < items[0].length; itm++) {
					if (items[row][itm] == "1") {
						str += possible_items[itm];
					}
				}
				this.aData.push(str);
			}

			/*
			 * To get the character array for which we need to find
			 * combinations
			 */
			this.itm = possible_items.slice(0, items[0].length);
			this.aCombi = frequentpatterngenerator.algorithms.bruteforce.generateCombinations(this.itm);
		},

		generateCombinations : function(chars) {
			var result = [];
			var f = function(prefix, chars) {
				for (var i = 0; i < chars.length; i++) {
					result.push(prefix + chars[i]);
					f(prefix + chars[i], chars.slice(i + 1));
				}
			}
			f('', chars);
			return result;
		},

		computeSupport : function(MinsupValue) {
			var that = this;
			this.aCombi.forEach(function(key) {
				var sup = 0;
				that.aData.forEach(function(key1) {
					if (key1.indexOf(key) !== -1) {
						sup = sup + 1;
					} else {
						var flag = false;
						var temp = key.split("");
						for (i = 0; i < temp.length; i++) {
							if (key1.indexOf(temp[i]) === -1)
								flag = true;
						}
						if (!flag) {
							sup = sup + 1;
						}
					}
				})
				that.ItemsetSupportData[key] = sup;
			});
			var result = this.findItemsWithMinSup(MinsupValue)
			return result;
		},
		
		possibleItemSets: function(){
			var that = this;
			that.oPossibleItemSets = {};
			for(s=0; s<=this.itm.length;s++){
				var ar = [];
				for (key in that.ItemsetSupportData) {
					if (that.ItemsetSupportData[key] == s) {
						ar.push(key);
					}
				}
				that.oPossibleItemSets[s] = ar;
			}
			return that.oPossibleItemSets;
		},

		findItemsWithMinSup : function(minsup) {
			var that = this;
			that.bruteRes = {};
			// assume max is the first key's value
			that.max = that.ItemsetSupportData[Object.keys(that.ItemsetSupportData)[0]];
			for (l = 0; l < Object.keys(that.ItemsetSupportData).length; l++) {
				if (that.ItemsetSupportData[Object.keys(that.ItemsetSupportData)[l]] > that.max) {
					that.max = that.ItemsetSupportData[Object.keys(that.ItemsetSupportData)[l]];
				}
			}

			for (s = minsup; s <= that.max; s++) {
				var ar = [];
				for (key in that.ItemsetSupportData) {
					if (that.ItemsetSupportData[key] == s) {
						ar.push(key);
					}
				}
				that.bruteRes[s] = ar;
			}
			return that.bruteRes;
		}
};
