function LabNotesView() {

   // set the date
   var d = new Date();
   var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
   this.today = "Lab Notes for " + months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();

   // currect section number
   this.section = 0;

   // number of visible sections
   this.numSect = 0;

   // hidden boolean flags for sections
   this.hidden = [];

   // type of sect: 0 = fly, 1 = table
   this.secType = [];

   // for flies: [phenoCode, phenoString, repNum, source]
   // for tables, [cross number, igSx, hypTested]
   this.codes = [];

   // function for setting up UI stuff
   this.setup = function(cntrl, views) {

      // the various views
      this.cntrl = cntrl;
      this.mv = views[1];
      this.cv = views[2];
      this.av = views[3];
      this.lv = views[4];

      // the export button
      this.exprtBtn = document.getElementById("exprtBtn");

      // location for the exported sections
      this.loc = document.getElementById("lvSectns");

      // show the date
      document.getElementById("lvTitle").innerHTML = this.today;
   }

   // function to add the magnified fly to lab notes
   this.addFlyToNotes = function(fly) {
      var sect = this.section + 1;
      var txt = "";

      // create and insert the section HTML code
      txt = txt + "<div class='lvSect' id='section" + sect + "'>";
      txt = txt + "<table role='presentation' style='border:none; border-collapse:collapse; font-family: Arial, sans-serif; font-size:14pt;'>";
      txt = txt + "<tr><td style='text-align:right; width:400px; padding:10px 5px 5px 0px; padding-bottom:10px;'>";
      txt = txt + "<canvas tabindex='0' id='fly" + sect + "' style='border:none;' width='300px' height='300px'></canvas></td>";
      txt = txt + "<td style='vertical-align:top; padding-left:20px; padding-top:20px;'>";
      txt = txt + "<span tabindex='0'>Source:&nbsp;&nbsp;" + fly.source + "<br>" + fly.phenoString + "<br><span class='visually-hidden'>Number</span> <span aria-hidden='true'>N</span> = " + fly.repNum + " with this phenotype</span>";
      txt = txt + "<p><textarea id='comment" + sect + "' aria-label='text area for comments' style='border:1px solid black; font-size:12pt;' rows='10' cols='50' maxlength='2000' placeholder='Enter comments here.'></textarea>";
	  txt = txt + "</td></tr></table>";
	  txt = txt + "<button class='close' aria-label='remove section with fly image' title='remove this section' onclick='lv.closeSect(" + sect + ")'>&#x2a2f;</button>"
      txt = txt + "</div>";
      this.loc.insertAdjacentHTML("beforeend", txt);

      // update the section variables
      this.section++;
      this.numSect++;
      this.hidden.push(false);
      this.secType.push(0);
      this.codes.push([fly.phenoCode, fly.phenoString, fly.repNum, fly.source]);

      // draw the fly
      var cnv = document.getElementById("fly" + sect);
      fly.drawFly(cnv, 2.5);

      // enable the Export button
      document.getElementById("notesExportBtn").disabled = false;

      // create a png version on the server
      var flyImage = new Image();
      flyImage.src = cnv.toDataURL("image/png");
      var formData= new FormData();
      formData.append("phenoCode", fly.phenoCode);
      formData.append("pngData", flyImage.src);
      var request = new XMLHttpRequest();
      request.open("POST.html", "flies/createFlyPng.html");
      request.send(formData);

      // close modal view and switch to Lab Notes View
      cntrl.closeMagView();
      this.cntrl.changeView(4);
      document.getElementById("section" + this.section).scrollIntoView();
	  document.getElementById("fly" + sect).focus();
	  document.getElementById("messages").textContent = "Focus is now on the fly image copied to the lab notes.";
   }

   // function to remove section
   this.closeSect = function(sect) {
      var sct = document.getElementById("section" + sect);
      if (confirm("Are you sure you want to delete the section from your lab notes?")) {
         sct.style.display = "none";
         this.hidden[sect-1] = true;
         this.numSect--;
         if (this.numSect == 0) {
            document.getElementById("notesExportBtn").disabled = true;
            document.getElementById("notesExportBtn").setAttribute("aria-disabled", "true");
         }
	     document.getElementById("messages").textContent = "Section removed from lab notes.";
      }
   }

   // function to add the results table to lab notes
   this.addRes = function(cr) {
      var sect = this.section + 1;
      var igSx = this.av.igSexOptions[cr-1];
      var data = igSx ? this.av.dataIgSxCr[cr-1] : this.av.dataCr[cr-1];
      var hyp = igSx ? this.av.hypTestedIgSx[cr-1] : this.av.hypTested[cr-1];
      var txt = "";
      var nr = data.length;
      var nc = hyp ? 7 : 3;
      var i = 0, j = 0;

      // create and insert the section HTML code
      txt = txt + "<div class='lvSect' id='section" + sect + "'>";
      txt = txt + "<div class='crossTitle' tabindex='0' id='tblTtl" + cr + "' " + "style='margin-top:12px;margin-bottom:12px;'>Results for Cross # " + cr + "<span class='visually-hidden'>. Sex is " + (igSx ? "ignored" : "included") + ". A test of hypothesis is " + (hyp ? "included" : "omitted") + ". There are " + nc + " columns and " + nr + " rows. Tab through the table cells.</span></div>";
      txt = txt + "<table class='results'>";
      for (i=0; i<nr; i++) {
         txt = txt + "<tr class='results'>";
         for (j=0; j<nc; j++) {
            if (i==0) {
               txt = txt + "<th scope='col' tabindex='0' class='results'" + ((j==0) ? " style='font-weight:bold; min-width:150px; text-align:left;'" : " style='font-weight:bold;'") + ">" + data[i][j] + "</th>";
            } else {
               txt = txt + "<" + (j==0 ? "th scope='row'" : "td")  + " tabindex='0' class='results' " + (i==nr-1 ? "style='font-weight:bold;" : "style='font-weight:normal;") + (j==0 ? " min-width:150px; text-align:left;'" : "'") + ">" + data[i][j] + "</" + (j==0 ? "th" : "td") + ">";
            }
         }
         txt = txt + "</tr>";
      }
      txt = txt + "</table>";
      if (hyp) {  // add test results
         var chiSqRes = igSx ? document.getElementById("chiResCrIgSx" + cr).children[0] : document.getElementById("chiResCr" + cr).children[0];
         txt = txt + "<div class='hypRes' style='display:block; margin-top:12px; margin-bottom:12px;'>";
         txt = txt + "<table role='presentation' style='border-collapse:collapse; border:none; margin:auto;'>";
         txt = txt + "<td tabindex='0' style='border:none; text-align:center; font-weight:bold;' colspan='2'>" + chiSqRes.rows[0].cells[0].innerHTML + "</td></tr>";
         txt = txt + "<tr tabindex='0'><td style='border:none; text-align:right; padding-right:12px;'>Chi-squared test statistic:</td>";
         txt = txt + "<td style='border:none; text-align:left'>" + chiSqRes.rows[1].cells[1].innerHTML + "</td></tr>";
         txt = txt + "<tr tabindex='0'><td style='border:none; text-align:right; padding-right:12px;'>Degrees of freedom:</td>";
         txt = txt + "<td style='border:none; text-align:left'>" + chiSqRes.rows[2].cells[1].innerHTML + "</td></tr>";
         txt = txt + "<tr tabindex='0'><td style='border:none; text-align:right; padding-right:12px;'>Level of significance:</td>";
         txt = txt + "<td style='border:none; text-align:left'>" + chiSqRes.rows[3].cells[1].innerHTML + "</td></tr></table></div>";
      }
      txt = txt + "<div style='display:block; width:100%; text-align:center;'><textarea id='comment" + sect;
      txt = txt + "'  aria-label='text area for comments' style='border:1px solid black; font-size:12pt;' rows='5' cols='80' maxlength='2000' placeholder='Enter comments here.'></textarea><br>&nbsp;</div>";
	  txt = txt + "<button class='close' aria-label='remove section with results for cross number " + cr + "' title='remove this section' onclick='lv.closeSect(" + sect + ")'>&#x2a2f;</button></div>";
      this.loc.insertAdjacentHTML("beforeend", txt);

      // update the section variables
      this.section++;
      this.numSect++;
      this.hidden.push(false);
      this.secType.push(1);
      this.codes.push([cr, igSx, hyp]);

      // enable the Export button
      document.getElementById("notesExportBtn").disabled = false;
      document.getElementById("notesExportBtn").setAttribute("aria-disabled", "false");

      // switch to Lab Notes View
      this.cntrl.changeView(4);
      document.getElementById("section" + this.section).scrollIntoView();
	  document.getElementById("tblTtl" + cr).focus();
	  document.getElementById("messages").textContent = "Focus is now on the data table copied to the lab notes.";
   }

   // function to export lab notes
   this.exportNotes = function() {
      var formData= new FormData();
      var bodyTxt = "";
      var notesPage = "";
      var nSects = this.secType.length;
      var i = 0;
      // header stuff
      bodyTxt = bodyTxt + "<body>\n";
      bodyTxt = bodyTxt + "<h1 role='heading' aria-level='1'>" + this.today + "</h1>\n";
      bodyTxt = bodyTxt + "<div class='sect' style='font-size:12pt; border-top:none;'>This temporary web page will expire in two weeks. ";
      bodyTxt = bodyTxt + "This URL may become unavailable after the expiration. You can use your browser to print this page or save it to your drive. ";
      bodyTxt = bodyTxt + "You only need to save the html file; fly images will remain available on the server.<br>&nbsp;</div>\n";
      // the sections
      for (i=0; i<nSects; i++) {
         if (!this.hidden[i]) {
            if (this.secType[i] == 0) {
               bodyTxt = bodyTxt + this.exportFlySect(i+1);
            } else {
               bodyTxt = bodyTxt + this.exportResSect(i+1);
            }
         }
      }

      // footer stuff
      bodyTxt = bodyTxt + "</body>\n";
      bodyTxt = bodyTxt + "</html>\n";
      formData.append("body", bodyTxt);
      var request = new XMLHttpRequest();
      request.onreadystatechange = function() {
         if (this.readyState == 4 && this.status == 200) {
            notesPage =  this.responseText;
            window.open("https://ScienceCourseware.org/FlyLabJS/" + notesPage);
         }
      };
      request.open("POST.html", "exportNotes2.php");
      request.send(formData);
   }

   // function to create fly section string for export
   this.exportFlySect = function(sect) {
      var txt = "";
      var flyDesc = this.codes[sect-1][1];
      flyDesc = flyDesc.slice(flyDesc.indexOf("hidden'>")+8,flyDesc.lastIndexOf("<"));
      txt = txt + "<div class='sect'>\n";
      txt = txt + "<h2 role='heading' aria-level='2'>Exported Fly Image</h2>\n";
      txt = txt + "<table role='presentation' class='fly'>\n      <tr>\n";
      txt = txt + "         <td style='text-align:right; width:400px; padding:10px 5px 5px 0px; padding-bottom:10px;'>\n";
      txt = txt + "            <img src='https://ScienceCourseware.org/FlyLabJS/flies/";
      txt = txt + "fly" + this.codes[sect-1][0] + ".png' ";
      txt = txt + "style='border:none;' width='300px' height='300px' alt='" + flyDesc + "' title='" + flyDesc + "'></img>\n";
      txt = txt + "         </td>\n";
      txt = txt + "         <td style='vertical-align:top; padding-left:20px; padding-top:20px;'>\n";
      txt = txt + "            Source:&nbsp;&nbsp;" + this.codes[sect-1][3] + "<br>" + this.codes[sect-1][1] + "<br> N = " + this.codes[sect-1][2] + " with this phenotype\n";
      txt = txt + "            <div class='comment'><strong>Comments:</strong>&nbsp;&nbsp;";
      var cmnt = this.convertHTML(document.getElementById("comment" + sect).value);
      if (cmnt.length == 0) {
         cmnt = "(none)";
      }
      txt = txt + cmnt + "</div>\n";
      txt = txt + "         </td>\n";
      txt = txt + "      </tr>\n";
      txt = txt + "   </table>\n";
      txt = txt + "</div>\n";
      return txt;   
   }

   // function to create results section string for export
   this.exportResSect = function(sect) {
      var data = this.codes[sect-1][1] ? this.av.dataIgSxCr[this.codes[sect-1][0]-1] : this.av.dataCr[this.codes[sect-1][0]-1];
      var txt = "";
      var nr = data.length;
      var nc = this.codes[sect-1][2] ? 7 : 3;
      var i = 0, j = 0;
      txt = txt + "<div class='sect'>\n";
      txt = txt + "<h2 role='heading' aria-level='2' id='tblTtl" + this.codes[sect-1][0] + "'>Results for Cross #" + this.codes[sect-1][0] + "</h2>\n";
      txt = txt + "<table class='results'>\n";
      for (i=0; i<nr; i++) {
         txt = txt + "<tr class='results'>\n";
         for (j=0; j<nc; j++) {
            if (i==0) {
               txt = txt + "<th scope='col' class='results'" + ((j==0) ? " style='font-weight:bold; min-width:150px; text-align:left;'" : " style='font-weight:bold;'") + ">" + data[i][j] + "</th>";
            } else {
               txt = txt + "<" + (j==0 ? "th scope='row'" : "td")  + " class='results' " + (i==nr-1 ? "style='font-weight:bold;" : "style='font-weight:normal;") + (j==0 ? " min-width:150px; text-align:left;'" : "'") + ">" + data[i][j] + "</" + (j==0 ? "th" : "td") + ">";
            }
         }
         txt = txt + "   </tr>\n";
      }
      txt = txt + "</table>";
      if (this.codes[sect-1][2]) {  // add test results
         var chiSqRes = this.codes[sect-1][1] ? document.getElementById("chiResCrIgSx" + this.codes[sect-1][0]).children[0] : document.getElementById("chiResCr" + this.codes[sect-1][0]).children[0];
         txt = txt + "<div class='hypRes'>\n";
         txt = txt + "   <table role='presentation' style='border-collapse:collapse; border:none; margin:auto;'>\n";
         txt = txt + "      <tr>\n";
         txt = txt + "         <td style='border:none; text-align:right; padding-right:12px; font-weight:bold;' colspan='2'>Results for the Chi-squared Test</td>\n";
         txt = txt + "      </tr>\n";
         txt = txt + "      <tr>\n";
         txt = txt + "         <td style='border:none; text-align:right; padding-right:12px;'>Chi-squared test statistic:</td>\n";
         txt = txt + "         <td style='border:none; text-align:left'>" + chiSqRes.rows[1].cells[1].innerHTML + "</td>\n";
         txt = txt + "      </tr>\n";
         txt = txt + "      <tr>\n";
         txt = txt + "         <td style='border:none; text-align:right; padding-right:12px;'>Degrees of freedom:</td>\n";
         txt = txt + "         <td style='border:none; text-align:left'>" + chiSqRes.rows[2].cells[1].innerHTML + "</td>\n";
         txt = txt + "      </tr>\n";
         txt = txt + "      <tr>\n";
         txt = txt + "         <td style='border:none; text-align:right; padding-right:12px;'>Level of significance:</td>\n";
         txt = txt + "         <td style='border:none; text-align:left'>" + chiSqRes.rows[3].cells[1].innerHTML + "</td>\n";
         txt = txt + "      </tr>\n";
         txt = txt + "   </table>\n";
         txt = txt + "</div>\n";
      }
      txt = txt + "<div class='comment2'><strong>Comments:</strong>&nbsp;&nbsp;";
      var cmnt = this.convertHTML(document.getElementById("comment" + sect).value);
      if (cmnt.length == 0) {
         cmnt = "(none)";
      }
      txt = txt + cmnt + "<br>&nbsp;</div>\n";
      txt = txt + "</div>\n";
      return txt;   
   }

   this.convertHTML = function(str) {
     let regex = /[&|<|>|"|']/g;
     let htmlString = str.replace(regex, function(match){
       if(match === "&"){
         return "&amp;";
       }else if(match === "<"){
         return "&lt;"
       }else if(match === ">"){
         return "&gt;";
       }else if(match === '"'){
         return "&quot;";
       }else{
         return "&apos;";
       }
     });
     return htmlString;
   }
}