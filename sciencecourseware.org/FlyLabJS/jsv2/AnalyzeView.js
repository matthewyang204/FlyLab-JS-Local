function AnalyzeView() {

   // indicator variables for the crosses drop down
   this.dropOpen = false;
   this.dropDisplayed = 0;

   // array of checkbox options for crosses
   this.igSexOptions = [];
   this.hypOptions = [];
   this.hypOptionsIgSx = [];

   // array of indicators for hypothesis tests
   this.hypTested = [];
   this.hypTestedIgSx = [];

   // array of data tables for crosses
   this.dataCr = [];
   this.dataIgSxCr = [];

   // function for setting up UI stuff
   this.setup = function(cntrl, views) {

      // the crosses drop down
      this.cdd = document.getElementById("analyzeDropDown");
      this.selCrBut = document.getElementById("selAnalyzeView");

      // the various main views
      this.cntrl = cntrl;
      this.dv = views[0];
      this.mv = views[1];
      this.cv = views[2];
      this.lv = views[4];

      // the div for content
      this.aDiv = document.getElementById("avContent");

      // the checkmark buttons and spans
      this.chkButIgSex = document.getElementById("igSex");
      this.chkSpanIgSex = document.getElementById("igSxChK");
      this.chkButHyp = document.getElementById("hyp");
      this.chkSpanHyp = document.getElementById("hypChK");
   }

   // function to open the crosses list in the Analyze View
   this.openList = function() {
      if (!this.dropOpen) {
         this.cdd.style.display = "block";
         this.cdd.setAttribute("aria-expanded", "true");
         this.dropOpen = true;
         if (this.cntrl.numCrosses > 12) {
            this.cdd.style.borderRight = "1px solid #41719c";
            this.cdd.style.borderBottom = "1px solid #41719c";
            this.cdd.lastElementChild.style.borderBottom = "none";
         }
         document.getElementById("selAnalyzeView").children[0].rows[0].cells[1].innerHTML="";
         document.getElementById("selAnalyzeView").children[0].rows[0].cells[1].innerHTML="&#9650;";
         document.getElementById("messages").textContent = "The drop down menu for selecting crosses has expanded.";
      } else {
         this.cdd.style.display = "none";
         this.cdd.setAttribute("aria-expanded", "false");
         this.dropOpen = false;
         if (this.cntrl.numCrosses > 12) {
            this.cdd.style.borderRight = "none";
            this.cdd.style.borderBottom = "none";
            this.cdd.lastElementChild.style.borderBottom = "1px solid #41719c";
         }
         document.getElementById("selAnalyzeView").children[0].rows[0].cells[1].innerHTML="";
         document.getElementById("selAnalyzeView").children[0].rows[0].cells[1].innerHTML="&#9660;";
         document.getElementById("messages").textContent = "The drop down menu for selecting crosses has contracted. Data for cross #" + this.dropDisplayed  + " are displayed.";
         document.getElementById("selAnalyzeView").focus();
      }
   }

   // function to change the cross in the Analyze View
   this.changeView = function(cn) {
      if (this.dropDisplayed > 0) {
         document.getElementById("analyzeDropDown").children[this.dropDisplayed-1].setAttribute("class", "crossesbtn");
         document.getElementById("crossAnIgSx"+this.dropDisplayed).style.display = "none";
         document.getElementById("crossAnIgSx"+this.dropDisplayed).setAttribute("aria-hidden", "true");
         document.getElementById("crossAn"+this.dropDisplayed).style.display = "none";
         document.getElementById("crossAn"+this.dropDisplayed).setAttribute("aria-hidden", "true");
      }
      this.dropDisplayed = cn;
      document.getElementById("analyzeDropDown").children[this.dropDisplayed-1].setAttribute("class", "crossesbtn active");
      this.igSexOptions[cn-1] = !this.igSexOptions[cn-1];
      this.ignoreSex();
      document.getElementById("analyzeDropDown").children[cn-1].setAttribute("class", "crossesbtn active");
      this.openList();
   }

   // function to add a new cross in the Analyze View
   this.addCross = function(flies) {
      var i = 0, j = 0;
      var nOff = flies.length - 2;
      var content = "";
      var contentIgSx = "";

      // add a new crosses button
      var cn = this.cntrl.numCrosses;
      this.cdd.insertAdjacentHTML("beforeend", "<button type='button' class='crossesbtn' aria-controls='avContent' onclick='av.changeView(" + cn + ")'>Cross #" + cn + "</button>");

      // add default options to checkboxes
      this.igSexOptions.push(false);
      this.hypOptions.push(false);
      this.hypOptionsIgSx.push(false);
      this.chkSpanIgSex.style.display = "none";
      this.chkSpanHyp.style.display = "none";

      // add indicator for hypothesis testing
      this.hypTested.push(false);

      // compute tables for sex included and sex ignored
      this.computeTable(cn, flies, false);
      this.computeTable(cn, flies, true);

      // add the title
      var nRows = this.dataCr[cn-1].length;
      content = content + "<div class='cross' id='crossAn" + cn + "' aria-hidden='true'>";
      content = content + "<div class='crossTitle' tabindex='0' id='tblTtlCr" + cn + "' " + "style='margin-top:64px;margin-bottom:4px;'>Results for Cross #" + cn + " <span class='visually-hidden'>. Sex is included. Omits a test of hypothesis. There are 3 columns and " + nRows + " rows. Tab through table cells.</span></div>";

      // create default empty table for sex included
      content = content + "<table role='presentation' style='margin:auto; border:none;'><tr><td style='text-align:center'>";
      content = content + "<table class='results' id='tblCr" + cn + "'>";

      for (i=0; i<nRows; i++) {
         content = content + "<tr class='results'>";
         for (j=0; j<3; j++) {
            if (i==0) {
               content = content + "<th scope='col' tabindex='0' class='results'" + ((j==0) ? " style='font-weight:bold; min-width:150px; text-align:left;'" : " style='font-weight:bold;'") + "></th>";
            } else {
               content = content + "<" + (j==0 ? "th scope='row'" : "td")  + " tabindex='0' class='results' " + (i==nRows-1 ? "style='font-weight:bold;" : "style='font-weight:normal;") + (j==0 ? " min-width:150px; text-align:left;'" : "'") + "></" + (j==0 ? "th" : "td") + ">";
            }
         }
         for (j=3; j<7; j++) {
            content = content + "<" + (i==0 ? "th scope='col'" : "td") + ((j==3 && i>0 && i<nRows-1) ? " style='display:none;" : " tabindex='0' style='display:none;") + ((i==0 || i==nRows-1) ? " font-weight:bold;" : " font-weight:normal;") + "' class='results cellHideCr" + cn + "'></" + (i==0 ? "th" : "td") + ">";
         }
         content = content + "</tr>"
      }

      // add the title
      var nRows = this.dataIgSxCr[cn-1].length;
      contentIgSx = contentIgSx + "<div class='cross' id='crossAnIgSx" + cn + "'>";
      contentIgSx = contentIgSx + "<div class='crossTitle' tabindex='0' id='tblTtlIgSxCr" + cn + "' " + "style='margin-top:64px;margin-bottom:4px;'>Results for Cross #" + cn + " <span class='visually-hidden'>. Sex is ignored. Omits a test of hypothesis. There are 3 columns and " + nRows + " rows. Tab through table cells.</span></div>";

      // create default empty table for sex ignored
      contentIgSx = contentIgSx + "<table role='presentation' style='margin:auto; border:none;'><tr><td style='text-align:center'>";
      contentIgSx = contentIgSx + "<table class='results' id='tblIgSxCr" + cn + "'>";
	  
      for (i=0; i<nRows; i++) {
         contentIgSx = contentIgSx + "<tr class='results'>";
         for (j=0; j<3; j++) {
            if (i==0) {
               contentIgSx = contentIgSx + "<th scope='col' tabindex='0' class='results'" + ((j==0) ? " style='font-weight:bold; min-width:150px; text-align:left;'" : " style='font-weight:bold;'") + "></th>";
            } else {
               contentIgSx = contentIgSx + "<" + (j==0 ? "th scope='row'" : "td")  + " tabindex='0' class='results' " + (i==nRows-1 ? "style='font-weight:bold;" : "style='font-weight:normal;") + (j==0 ? " min-width:150px; text-align:left;'" : "'") + "></" + (j==0 ? "th" : "td") + ">";
            }
         }
         for (j=3; j<7; j++) {
            contentIgSx = contentIgSx + "<" + (i==0 ? "th scope='col'" : "td") + ((j==3 && i>0 && i<nRows-1) ? " style='display:none;" : " tabindex='0' style='display:none;") + ((i==0 || i==nRows-1) ? " font-weight:bold;" : " font-weight:normal;") + "' aria-hidden='true' class='results cellHideCrIgSx" + cn + "'></" + (i==0 ? "th" : "td") + ">";
         }
         contentIgSx = contentIgSx + "</tr>"
      }

      // end the table and add test button
      content = content + "</table></td></tr><tr><td id='testBtn" + cn + "' aria-hidden='true' style='text-align:right; border:none; display:none;'>";
      contentIgSx = contentIgSx + "</table></td></tr><tr><td id='testBtnIgSx" + cn + "' aria-hidden='true' style='text-align:right; border:none; display:none;'>";
      content = content + "<button type='button' style='width:200px;' class='select-small' id='TestHypCr" + cn + "' onclick='av.testHyp(" + cn + ", false)'><span class='visually-hidden'>Test your hypothesis</span><span aria-hidden='true'><u>T</u>est Your Hypothesis</span></button></td></tr></table>";
      contentIgSx = contentIgSx + "<button type='button' style='width:200px;' class='select-small' id='TestHypCrIgSx" + cn + "' onclick='av.testHyp(" + cn + ", true)'><span class='visually-hidden'>Test your hypothesis</span><span aria-hidden='true'><u>T</u>est Your Hypothesis</span></button></td></tr></table>";

      // add chi-sq results
      var chiSqRes = "";
      chiSqRes = chiSqRes + "<table role='presentation' style='border-collapse:collapse; border:none; margin:auto;'>";
	  chiSqRes = chiSqRes + "<tr><td tabindex='0' colspan='2' style='font-weight:bold;border:none;text-align:center;'>Results for the Chi-squared Test</td></tr>";
      chiSqRes = chiSqRes + "<tr tabindex='0'><td style='border:none; text-align:right; padding-right:12px;'>Chi-squared test statistic:</td>";
      chiSqRes = chiSqRes + "<td style='border:none; text-align:left'>&mdash;</td></tr>";
      chiSqRes = chiSqRes + "<tr tabindex='0'><td style='border:none; text-align:right; padding-right:12px;'>Degrees of freedom:</td>";
      chiSqRes = chiSqRes + "<td style='border:none; text-align:left'>&mdash;</td></tr>";
      chiSqRes = chiSqRes + "<tr tabindex='0'><td style='border:none; text-align:right; padding-right:12px;'>Level of significance:</td>";
      chiSqRes = chiSqRes + "<td style='border:none; text-align:left'>&mdash;</td></tr></table></div>";
      content = content + "<div class='hypRes' aria-hidden='true' id='chiResCr" + cn + "'>" + chiSqRes;
      contentIgSx = contentIgSx + "<div class='hypRes' aria-hidden='true' id='chiResCrIgSx" + cn + "'>" + chiSqRes;

      // button to add to lab notes
      var addBtn = "<div class='hypRes' style='display:block; width:302px;'>";
      addBtn = addBtn + "<button type='button' class='select' style='position:relative; width:300px; margin:14px 0px 14px 0px;' onclick='lv.addRes(" + cn + ")'><span class='visually-hidden'>Add Results to Lab Notes</span><span aria-hidden='true'>Add <u>R</u>esults to Lab Notes</span></button></div>";
      content = content + addBtn;
      contentIgSx = contentIgSx + addBtn;

      // end of Analysis View content
      content = content + "</div>";
      contentIgSx = contentIgSx + "</div>";

      // insert the default content
      this.aDiv.insertAdjacentHTML("beforeend", content);
      this.aDiv.insertAdjacentHTML("beforeend", contentIgSx);

      // fill the tables with data
      this.fillTable(cn, false);
      this.fillTable(cn, true);
	 
      // hide the div with the ignore sex option
      document.getElementById("crossAnIgSx" + cn).style.display = "none";
      document.getElementById("crossAnIgSx" + cn).setAttribute("aria-hidden", "true");

      // select the new cross and display it
      this.dropOpen = true;
      this.changeView(cn);
   }

   this.computeTable = function(cn, flies, igSx) {
      var i = 0, j = 0;
      var nOff = flies.length - 2;
      var total = 0;
      var tbl = [["Phenotype", "Observed", "Proportion", "Hypothesis", "Probability", "Expected", "<span class='visually-hidden'>chi-squared term</span><span aria-hidden='true'>(O&ndash;E)<sup>2</sup>/E</span>"],[]];
      if (!igSx) {
         // compute table for sex included
         tbl[nOff+1] = ["Total", "0", "1.0000", "&mdash;", "&mdash;", "&mdash;", "&mdash;"];
         for (i=1; i <= nOff; i++) {
            tbl[i] = [flies[i+1].phenoString, 0, 0, 0, 0, 0, 0];
            tbl[i][1] = flies[i+1].repNum.toFixed(0);
            total = total + flies[i+1].repNum;
            tbl[i][3] = "<input aria-label='Enter your hypothesis.' class='hypInput' id='hypval" + (i-1) + "Cr" + cn + "' value=''>";
            tbl[i][4] = "&mdash;";
            tbl[i][5] = "&mdash;";
            tbl[i][6] = "&mdash;";
         }
         tbl[nOff+1][1] = total.toFixed(0);
         for (i=1; i <= nOff; i++) {
            tbl[i][2] =  (flies[i+1].repNum / total).toFixed(4);
         }
         this.dataCr[cn-1] = tbl;
      } else {
         // compute table for sex ignored
         var row = 1, i = 2;
         var phStr = "";
         while (i < nOff+2) {
            if ((i != nOff+1) && (flies[i].phenoCode == flies[i+1].phenoCode - 1)) {
               phStr = flies[i].phenoString;
               if (flies[i].phenoCode < 2) {
                  phStr = "<span aria-hidden='true'><abbr title='wild type'>+</abbr></span><span class='visually-hidden'>wild type</span>";
               } else {
                  phStr = flies[i].isMale ? phStr.replace(/male fly with /g,"") : phStr.replace(/female fly with /g,"");
                  phStr = flies[i].isMale ? phStr.replace(/Male: /g,"") : phStr.replace(/Female: /g,"");
               }
               tbl[row] = [phStr, 0, 0, 0, 0, 0, 0];
               tbl[row][1] = (flies[i].repNum + flies[i+1].repNum).toFixed(0);
               total = total + flies[i].repNum + flies[i+1].repNum;
               i = i + 2;
            } else {
               phStr = flies[i].phenoString;
               if (flies[i].phenoCode < 2) {
                  phStr = "<span aria-hidden='true'><abbr title='wild type'>+</abbr></span><span class='visually-hidden'>wild type</span>";
               } else {
                  phStr = flies[i].isMale ? phStr.replace(/male fly with /g,"") : phStr.replace(/female fly with /g,"");
                  phStr = flies[i].isMale ? phStr.replace(/Male: /g,"") : phStr.replace(/Female: /g,"");
               }
               tbl[row] = [phStr, 0, 0, 0, 0, 0, 0];
               tbl[row][1] = flies[i].repNum.toFixed(0);
               total = total + flies[i].repNum;
               i++;
            }
            tbl[row][3] = "<input aria-label='Enter your hypothesis.' class='hypInput' id='hypvalIgSx" + (row-1) + "Cr" + cn + "' value=''>";
            tbl[row][4] = "&mdash;";
            tbl[row][5] = "&mdash;";
            tbl[row][6] = "&mdash;";
            row++;
         }
         tbl[row] = ["Total", 0, 0, 0, 0, 0, 0];
         tbl[row][1] = total.toFixed(0);
         tbl[row][2] = "1.0000";
         tbl[row][3] = "&mdash;";
         tbl[row][4] = "&mdash;";
         tbl[row][5] = "&mdash;";
         tbl[row][6] = "&mdash;";
         for (i=1; i < row; i++) {
            tbl[i][2] =  (Number(tbl[i][1]) / total).toFixed(4);
         }
         this.dataIgSxCr[cn-1] = tbl;
      }
   }

   this.fillTable = function(cn, igSx) {
      var i = 0, j = 0;
      var data = igSx ? this.dataIgSxCr[cn-1] : this.dataCr[cn-1];
      var nrows = data.length;
      var tbl = igSx ? document.getElementById("tblIgSxCr" + cn) : document.getElementById("tblCr" + cn);
      for (i=0; i<nrows; i++) {
         for (j=0; j<7; j++) {
            tbl.rows[i].cells[j].innerHTML = data[i][j];
         }
      }
   }

   this.ignoreSex = function() {
      var cn = this.dropDisplayed;
      this.igSexOptions[cn-1] = !this.igSexOptions[cn-1];
      if (this.igSexOptions[cn-1]) {
         this.chkSpanIgSex.style.display = "inline";
		 document.getElementById("igSex").setAttribute("aria-checked", "true");
         document.getElementById("crossAnIgSx" + cn).style.display = "block";
         document.getElementById("crossAnIgSx" + cn).setAttribute("aria-hidden", "false");
         document.getElementById("crossAn" + cn).style.display = "none";
         document.getElementById("crossAn" + cn).setAttribute("aria-hidden", "true");
      } else {
         this.chkSpanIgSex.style.display = "none";
		 document.getElementById("igSex").setAttribute("aria-checked", "false");
         document.getElementById("crossAnIgSx" + cn).style.display = "none";
         document.getElementById("crossAnIgSx" + cn).setAttribute("aria-hidden", "true");
         document.getElementById("crossAn" + cn).style.display = "block";
         document.getElementById("crossAn" + cn).setAttribute("aria-hidden", "false");
      }
      if (this.igSexOptions[cn-1]) {
         this.hypOptionsIgSx[cn-1] = !this.hypOptionsIgSx[cn-1];
      } else {
         this.hypOptions[cn-1] = !this.hypOptions[cn-1];
      }      
      this.showHideHyp(this.igSexOptions[cn-1]);
	  document.getElementById("messages").textContent = "Sex of flies will be " + (this.igSexOptions[cn-1] ? "ignored." : "included.");
   }
   
   this.showHideHyp = function(igSx) {
      var cn = this.dropDisplayed;
      var hypCells = igSx ? document.getElementsByClassName("cellHideCrIgSx" + cn) : document.getElementsByClassName("cellHideCr" + cn);
      var testBtn = igSx ? document.getElementById("testBtnIgSx" + cn) : document.getElementById("testBtn" + cn);
      var chiSqRes = igSx ? document.getElementById("chiResCrIgSx" + cn) : document.getElementById("chiResCr" + cn);
      var i = 0;
      if (igSx) {
         this.hypOptionsIgSx[cn-1] = !this.hypOptionsIgSx[cn-1];
      } else {
         this.hypOptions[cn-1] = !this.hypOptions[cn-1];
      }
      var hypOpt = igSx ? this.hypOptionsIgSx[cn-1] : this.hypOptions[cn-1];
      this.chkSpanHyp.style.display = hypOpt ? "inline" : "none";
	  document.getElementById("hyp").setAttribute("aria-checked", hypOpt ? "true" : "false");
      for(i = 0; i < hypCells.length; i++) {
         hypCells[i].style.display = hypOpt ? "table-cell" : "none";
		 hypCells[i].setAttribute("aria-hidden", (hypOpt ? "false" : "true"));
      }
      testBtn.style.display = hypOpt ? "table-cell" : "none";
      testBtn.setAttribute("aria-hidden", (hypOpt ? "false" : "true"));
      chiSqRes.style.display = hypOpt ? "block" : "none";
      chiSqRes.setAttribute("aria-hidden", (hypOpt ? "false" : "true"));
	  if (igSx) {
	     document.getElementById("tblTtlIgSxCr" + cn).innerHTML = document.getElementById("tblTtlIgSxCr" + cn).innerHTML.replace(hypOpt ? "3 columns" : "7 columns", hypOpt ? "7 columns" : "3 columns");
		 document.getElementById("tblTtlIgSxCr" + cn).innerHTML = document.getElementById("tblTtlIgSxCr" + cn).innerHTML.replace(hypOpt ? "Omits" : "Includes", hypOpt ? "Includes" : "Omits");
	  } else {
	  	 document.getElementById("tblTtlCr" + cn).innerHTML = document.getElementById("tblTtlCr" + cn).innerHTML.replace(hypOpt ? "3 columns" : "7 columns", hypOpt ? "7 columns" : "3 columns");
		 document.getElementById("tblTtlCr" + cn).innerHTML = document.getElementById("tblTtlCr" + cn).innerHTML.replace(hypOpt ? "Omits" : "Includes", hypOpt ? "Includes" : "Omits");
	  }
	  document.getElementById("messages").textContent = "A test of hypothesis will be " + (hypOpt ? "included." : "omitted.");
   }

   this.testHyp = function(cn, igSx) {
      var data = igSx ? this.dataIgSxCr[cn-1] : this.dataCr[cn-1];
      var chiSqRes = igSx ? document.getElementById("chiResCrIgSx" + cn).children[0] : document.getElementById("chiResCr" + cn).children[0];
      var btnCell = igSx ? document.getElementById("testBtnIgSx" + cn) : document.getElementById("testBtn" + cn);
      var nrows = data.length;
      var i = 0;
      if (nrows <= 3) {
         alert("You need two or more phenotypes for a chi-squared test.");
         return;
      }
      var nflies = Number(igSx ? this.dataIgSxCr[cn-1][nrows-1][1] : this.dataCr[cn-1][nrows-1][1]);
      var i = 0, nhyp = 0, chisq = 0;
      var obs = [];
      var hyp = [];
      var probs = [];
      var pred = [];
      var chiVals = [];
      // read the hypothesis values
      for (i=0; i<nrows-2; i++) {
         hyp.push(igSx ? document.getElementById("hypvalIgSx" + i + "Cr" + cn).value : document.getElementById("hypval" + i + "Cr" + cn).value);
         if (isNaN(hyp[i]) || Number(hyp[i]) <= 0) {
            alert("The hypothesis entry in position " + (i+1) + " must be a positive number.");
            return;
         }
         nhyp = nhyp + Number(hyp[i]);
         obs.push(Number(data[i+1][1]));
      }
      // compute the remaining test values
      for (i=0; i<nrows-2; i++) {
         probs.push(hyp[i]/nhyp);
         pred.push(probs[i] * nflies);
         chiVals.push((obs[i] - pred[i])*(obs[i] - pred[i])/pred[i]);
         chisq = chisq + chiVals[i];
      }
      // update the data table
      var tbl = igSx ? document.getElementById("tblIgSxCr" + cn) : document.getElementById("tblCr" + cn);
      for (i=0; i<nrows-2; i++) {
         tbl.rows[i+1].cells[3].setAttribute("tabindex", "0");
		 data[i+1][3] = hyp[i];
         data[i+1][4] = probs[i].toFixed(4);
         data[i+1][5] = pred[i].toFixed(2);
         data[i+1][6] = chiVals[i].toFixed(2);
      }
      data[nrows-1][3] = (Math.abs(nhyp - Math.floor(nhyp)) < 0.00001) ? nhyp.toFixed(0) : nhyp.toFixed(3);
      data[nrows-1][4] = "1.0000";
      data[nrows-1][5] = nflies.toFixed(2);
      data[nrows-1][6] = chisq.toFixed(2);
      this.fillTable(cn, igSx);
      // show the test results
      chiSqRes.rows[1].cells[1].innerHTML = chisq.toFixed(2);
      chiSqRes.rows[2].cells[1].innerHTML = nrows-3;
      chiSqRes.rows[3].cells[1].innerHTML = (1 - chisqCdf(nrows-3, chisq)).toFixed(4);
      // change the hypothesis tested indicator and button
      if (igSx) {
         this.hypTestedIgSx[cn-1] = true;
      } else {
         this.hypTested[cn-1] = true;
      }
      btnCell.innerHTML = "<button type='button' style='width:200px;' class='select-small' id='NewHypCr" + cn + "' onclick='av.newHyp(" + cn + ", " + igSx + ")'><span aria-hidden='true'><u>N</u>ew Hypothesis</span><span class='visually-hidden'>New hypothesis</span></button>";
	  btnCell.children[0].focus();
	  document.getElementById("messages").textContent = "Hypothesis was tested.";
   }

   this.newHyp = function(cn, igSx) {
      this.computeTable(cn, this.cntrl.fliesCr[cn-1], igSx);
      this.fillTable(cn, igSx);
      // remove the test results
      var chiSqRes = igSx ? document.getElementById("chiResCrIgSx" + cn).children[0] : document.getElementById("chiResCr" + cn).children[0];
      chiSqRes.rows[1].cells[1].innerHTML = "&mdash;";
      chiSqRes.rows[2].cells[1].innerHTML = "&mdash;";
      chiSqRes.rows[3].cells[1].innerHTML = "&mdash;";
      // remove the tab index property for hypothesis cells
      var data = igSx ? this.dataIgSxCr[cn-1] : this.dataCr[cn-1];
      var nrows = data.length;
      var tbl = igSx ? document.getElementById("tblIgSxCr" + cn) : document.getElementById("tblCr" + cn);
	  for (i=0; i<nrows-2; i++) {
         tbl.rows[i+1].cells[3].removeAttribute("tabindex");
	  }
      // change the hypothesis tested indicator and button
      var btnCell = igSx ? document.getElementById("testBtnIgSx" + cn) : document.getElementById("testBtn" + cn);
      if (igSx) {
         this.hypTestedIgSx[cn-1] = false;
		 document.getElementById("tblTtlIgSxCr" + cn).focus();
      } else {
         this.hypTested[cn-1] = false;
		 document.getElementById("tblTtlCr" + cn).focus();
      }
      btnCell.innerHTML = "<button type='button' style='width:200px;' class='select-small' id='TestHypCr" + cn + "' onclick='av.testHyp(" + cn + ", " + igSx + ")'><span aria-hidden='true'><u>T</u>est Your Hypothesis</span><span class='visually-hidden'>Test your hypothesis</span></button>";
	  document.getElementById("messages").textContent = "Try a new hypothesis.";
   }

}

// Functions below are for computing significance probability for the chi-square distribution.
// Modified from Numerical Recipes in C: The Art of Scientific Computing, Second Edition
// by William H. Press,  Brian P. Flannery, Saul A. Teukolsky, and William T. Vetterling

function gammln(xx) {
  // LN of the gamma function
  var y = xx;
  var x = xx;
  var tmp = x + 5.5;
  var ser = 1.000000000190015;
  var cof = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
  var j;
  tmp -= (x+0.5)*Math.log(tmp);
  for (j=0; j<=5; j++) {
    y++;
    ser += cof[j]/y;
  }
  return -tmp+Math.log(2.5066282746310005*ser/x);
}

function gser(a, x) {
  // incomplete gamma function using series
  var n;
  var sum = 1/a;
  var del = sum;
  var ap = a;
  for (n=1; n<=100; n++) {
    ++ap;
    del *= x/ap;
    sum += del;
    if (Math.abs(del) < Math.abs(sum)*3e-7) {
      return sum*Math.exp(-x+a*Math.log(x)-gammln(a));
    }
  }
}

function gcf(a, x) {
  // incomplete gamma function using continued fraction
  var i;
  var an;
  var b = x+1-a;
  var c =1/1e-30;
  var d = 1/b;
  var del;
  var h = d;
  for (i=1; i<=100; i++) {
    an = -i*(i-a);
    b += 2;
    d = an*d+b;
    if (Math.abs(d) < 1e-30) { d = 1e-30; }
    c = b+an/c;
    if (Math.abs(c) < 1e-30) { c = 1e-30; }
    d = 1/d;
    del = d*c;
    h *= del;
    if (Math.abs(del-1) < 3e-7) {
      return Math.exp(-x+a*Math.log(x)-gammln(a))*h;
    }
  }
}

function gammp(a, x) {
  // incomplete gamma function
  if (x < (a+1)) {
    return gser(a, x);
  } else {
    return 1 - gcf(a, x);
  }
}

function chisqCdf(v, x) {
  // chi-squared cumulative prob function
  return gammp(v/2, x/2);
}
