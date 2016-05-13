jQuery.sap.declare("frequentpatterngenerator.algorithms.apriori");

frequentpatterngenerator.algorithms.apriori = {
      oC : {},
      aTDB : [],
      oResult: {
    	  1:[]
      },
      oItemSets: {},
      mCreateTransactionalDB: function(aInput, iMinSup){
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
            
            mAddToItemSet:function (sCode, iMinSup){
                  if(!this.oItemSets[iMinSup]){
                        this.oItemSets[iMinSup] = [];
                  }
                  this.oItemSets[iMinSup].push(sCode);
            },
            
            mGenerateCandidates: function (iPrevK){
              this.oC = {};
              for(var i=0; i < this.oResult[iPrevK].length - 1; i++){
                for(var j = i+1; j <= this.oResult[iPrevK].length; j++){
                  var sCandidate = jQuery.unique((this.oResult[iPrevK][i] + this.oResult[iPrevK][j]).split("")).sort().join("");
                  if(sCandidate.length === iPrevK + 1 && (!this.oC.hasOwnProperty(sCandidate))){
                    this.oC[sCandidate] = 0;
                  }
                }
              }
            },

            mGetCount: function(){
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

            getItemSets: function (aInput, iMinSup){
              this.oC= {};
              this.aTDB= [];
              this.oResult= {
              	  1:[]
                };
              this.oItemSets = {};
              this.mCreateTransactionalDB(aInput, iMinSup);
              for(var k=1; this.oResult[k].length; k++){
                this.mGenerateCandidates(k);
                this.mCalculateSupportForCandidates(k,iMinSup);
              }
//              console.log(this.oItemSets);
              return this.oItemSets;
            }
};
