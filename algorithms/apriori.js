jQuery.sap.declare("frequentpatterngenerator.algorithms.apriori");

frequentpatterngenerator.algorithms.apriori = {
      oC : {},
      aTDB : [],
      oResult: {
    	  1:[]
      },
      oItemSets: {},
	  oCandidates: {},
	  aLogHistory:[],

      mCreateTransactionalDB: function(aInput, iMinSup){
			this.aLogHistory.push("mCreateTransactionalDB");
              var aTemp, sCode;
              for(var i=0; i < aInput.length; i++){
                aTemp = [];
                for(var j=0; j < aInput[i].length; j++){
                  sCode = String.fromCharCode(65 + j);
                  if(aInput[i][j] === 1){
                     aTemp.push(sCode);
                      this.oC[sCode] = (this.oC[sCode] ? this.oC[sCode] + 1 : 1); 
                  }
                  if(i === aInput.length - 1 && this.oC[sCode] >= iMinSup){
                    this.oResult["1"].push(sCode);
                    this.mAddToItemSet(sCode, this.oC[sCode]);
                  }
                }
                this.aTDB.push(aTemp);
              } 
            },
            
            mAddToItemSet:function (sCode, iSup){
				this.aLogHistory.push("mAddToItemSet");
                  if(!this.oItemSets[iSup]){
                        this.oItemSets[iSup] = [];
                  }
                  this.oItemSets[iSup].push(sCode);
            },
            
            mGenerateCandidates: function (iPrevK, iMinSup){
				this.aLogHistory.push("mGenerateCandidates");
				var sCandidate, bIsCandidateValid;
				this.oCandidates[iPrevK] = this.oC;
              this.oC = {};
              for(var i=0; i < this.oResult[iPrevK].length - 1; i++){
                for(var j = i+1; j < this.oResult[iPrevK].length; j++){
					if(this.oCandidates[iPrevK][this.oResult[iPrevK][i]] >= iMinSup && this.oCandidates[iPrevK][this.oResult[iPrevK][j]] >= iMinSup){
                  sCandidate = jQuery.unique((this.oResult[iPrevK][i] + this.oResult[iPrevK][j]).split("")).sort().join("");
                  if(sCandidate.length === iPrevK + 1 && (!this.oC.hasOwnProperty(sCandidate))){
					bIsCandidateValid = this.mPruneCandidate(sCandidate,iMinSup);
					if(bIsCandidateValid){
                    this.oC[sCandidate] = 0;
					}
                  }
                }
              }
              }
              },
			
			mPruneCandidate: function(sCandidate, iMinSup){
					this.aLogHistory.push("mPruneCandidate");
					var sSubSet;
					for(var i = 0; i < sCandidate.length; i++){
						sSubSet = sCandidate.split("");
						sSubSet.splice(i,1);
						sSubSet = sSubSet.sort().join("");
						if(this.oCandidates[sSubSet.length][sSubSet] < iMinSup){
			            	return false;
			            }
					}
					return true;
				},
				
            mGetCount: function(){
				this.aLogHistory.push("mGetCount");
              var iSupport = 0;
              var aTDB = this.aTDB;
                  for(var j=0; j < aTDB.length; j++){
                      var bPresence = jQuery.map(arguments, function(sVal){
                         return aTDB[j].indexOf(sVal) > -1;
                      });
                    if(bPresence.indexOf(false) <= -1){
                      iSupport += 1;
                    }
                  }
                return iSupport;
            },

            mCalculateSupportForCandidates:function (iPrevK, iMinSup){
			this.aLogHistory.push("mCalculateSupportForCandidates");
              var aKeys = Object.keys(this.oC);
              if(!this.oResult[iPrevK + 1]){
                 this.oResult[iPrevK + 1] = [];
             }
              for(var i= 0; i<aKeys.length; i++){
                 this.oC[aKeys[i]] = this.mGetCount.apply(this, aKeys[i].split(""));
                 if(this.oC[aKeys[i]] >= iMinSup){
                   this.oResult[iPrevK+1].push(aKeys[i]);
                   this.mAddToItemSet(aKeys[i], this.oC[aKeys[i]]);
                 }
              }
            },
	
		mSortCandidatesBySupport: function(oCandidates){
			var oMainObj = {};
					var aKeys = Object.keys(oCandidates);
					for(var i=0; i < aKeys.length; i++){
					var aSubKeys = Object.keys(oCandidates[aKeys[i]]);
					for(var j = 0; j< aSubKeys.length; j++){
					if(!oMainObj.hasOwnProperty(oCandidates[aKeys[i]][aSubKeys[j]])){
					oMainObj[oCandidates[aKeys[i]][aSubKeys[j]]] = [];
					}
					oMainObj[oCandidates[aKeys[i]][aSubKeys[j]]].push(aSubKeys[j]);
					}
					}
					return oMainObj;
		},

            getItemSets: function (aInput, iMinSup){
            	var oController = this;
              this.oC= {};
              this.aTDB= [];
              this.oResult= {
              	  1:[]
                };
              this.oItemSets = {};
			  this.oCandidates = {};
			  this.aLogHistory = [];
			  
			  this.aLogHistory.push("getItemSets");
			  
              this.mCreateTransactionalDB(aInput, iMinSup);
              for(var k=1; this.oResult[k].length; k++){
                this.mGenerateCandidates(k, iMinSup);
                this.mCalculateSupportForCandidates(k,iMinSup);
              }
			  
		var oCandidatesBySupport = oController.mSortCandidatesBySupport(this.oCandidates);
			  var abc =  {		
					"oCandidatesBySupport":oCandidatesBySupport,
					  "oIntermediateCandidates":this.oCandidates,
					  "oItemSets":this.oItemSets,
					  "sMethodLog":this.aLogHistory
				  };
              return abc;
            }
};