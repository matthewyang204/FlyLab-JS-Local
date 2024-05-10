function CrossesView() {

   // indicator variables for the crosses drop down
   this.dropOpen = false;
   this.dropDisplayed = 0;

   // selected flies (fly #, cross #)
   this.fFlySelect = [0, 0];
   this.mFlySelect = [0, 0];

   // function for setting up UI stuff
   this.setup = function(cntrl, views) {

      // the crosses drop down and selection button
      this.cdd = document.getElementById("crossesDropDown");
      this.selCrBut = document.getElementById("selCrossView");

      // the various main views
      this.cntrl = cntrl;
      this.dv = views[0];
      this.mv = views[1];
      this.av = views[3];
      this.lv = views[4];

      // the div for content
      this.cDiv = document.getElementById("cvContent");

      // checkmark
      this.chkmk = new Image();
      this.chkmk.onload = function(){document.getElementById("osCnv").getContext("2d").drawImage(cv.chkmk, 0, 0)};
      this.chkmk.src = "img/check.png";
      this.flySelect = [0, 0];  // cross and number for selected fly
   }

   // function to open the crosses list in the Crosses View
   this.openList = function() {
      if (this.cntrl.numCrosses > 0) {
         if (!this.dropOpen) {
            this.cdd.style.display = "block";
            this.cdd.setAttribute("aria-expanded", "true");
            this.dropOpen = true;
            if (this.cntrl.numCrosses > 12) {
               this.cdd.style.borderRight = "1px solid #41719c";
               this.cdd.style.borderBottom = "1px solid #41719c";
               this.cdd.lastElementChild.style.borderBottom = "none";
            }
            document.getElementById("selCrossView").children[0].rows[0].cells[1].innerHTML="";
            document.getElementById("selCrossView").children[0].rows[0].cells[1].innerHTML="&#9650;";
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
            document.getElementById("selCrossView").children[0].rows[0].cells[1].innerHTML="";
            document.getElementById("selCrossView").children[0].rows[0].cells[1].innerHTML="&#9660;";
            document.getElementById("messages").textContent = "The drop down menu for selecting crosses has contracted. Cross #" + this.dropDisplayed  + " is displayed.";
            document.getElementById("selCrossView").focus();
         }
      }
   }

   // function to change the cross in the Crosses View
   this.changeView = function(cn) {
      if (this.dropDisplayed > 0) {
         document.getElementById("crossesDropDown").children[this.dropDisplayed-1].setAttribute("class", "crossesbtn");
         document.getElementById("cross"+this.dropDisplayed).style.display = "none";
         document.getElementById("cross"+this.dropDisplayed).setAttribute("aria-hidden", "true");
      }
      this.dropDisplayed = cn;
      document.getElementById("cross"+cn).style.display = "block";
      document.getElementById("cross"+cn).setAttribute("aria-hidden", "false");
      document.getElementById("crossesDropDown").children[cn-1].setAttribute("class", "crossesbtn active");
      this.openList();
   }

   // function to add a new cross in the Crosses View
   this.addCross = function(flies) {
      var nOff = flies.length - 2;
      var i = 0, j = 0;
      var content = "";

      // add a new crosses button
      var cn = this.cntrl.numCrosses;
      this.cdd.insertAdjacentHTML("beforeend", "<button type='button' class='crossesbtn' aria-controls='cvContent' onclick='cv.changeView(" + cn + ")'>Cross #" + cn + "</button>");

      // add the parents
      content = content + "<div class='cross' id='cross" + cn + "' aria-hidden='false'>";
      content = content + "<div tabindex='0' class='crossTitle'>Parents of Cross #" + cn + "</div>";
      content = content + "<table role='presentation' class='crosses'><tr><td style='width: 200px; vertical-align: bottom;'>";
      content = content + "<span aria-setsize='2' aria-posinset='1'>" + this.createFlyCell(0) + "</span>";
      content = content + "</td><td style='font-family: Arial, Helvetica, sans-serif; font-size: 50px; vertical-align: middle;'><span aria-hidden='true'>&#x2a2f;</span>	</td>";
      content = content + "<td style='width: 200px;  vertical-align: bottom;'>";
      content = content + "<span aria-setsize='2' aria-posinset='2'>" + this.createFlyCell(1) + "</span>";
      content = content + "</td></tr></table><br>";

      // add the offspring
      var nr = 1 + Math.floor((nOff - 1)/4);
      var flyNum = 0;
      var nc = 0;
      content = content + "<div tabindex='0' class='crossTitle'>Offspring of Cross #" + cn + "<span class='visually-hidden'>There are " + nOff + " different phenotypes.</span></div>";
      for (i = 0; i < nr; i++) {
         content = content + "<table role='presentation' class='crosses'><tr>";
         nc = (nOff - flyNum > 4) ? 4 : nOff - flyNum;
         for (j = 0; j < nc; j++) {
            content = content + "<td style='width: 200px; vertical-align: bottom;'>";
            content = content + "<span aria-setsize='" + nOff +"' aria-posinset='" + (flyNum+1) + "'>" + this.createFlyCell(flyNum+2) + "</span>";
            content = content + "</td>";
            flyNum++;
         }
         content = content + "</tr></table>";
         if (i < nr-1) {
            content = content + "<br>";
         }
      }

      // insert the content
      content = content + "</div>";
      this.cDiv.insertAdjacentHTML("beforeend", content);
      // draw the flies and set the source
      var cnv;
      for (i = 0; i < flies.length; i++) {
         cnv = document.getElementById("cnvFly" + i + "Cr" + cn);
         this.cntrl.fliesCr[cn-1][i].drawFly(cnv, 1.5);
         if (i < 2) {
            this.cntrl.fliesCr[cn-1][i].source = "Parents of Cross #" + cn;
         } else {
            this.cntrl.fliesCr[cn-1][i].source = "Offspring of Cross #" + cn;
         }
      }

      // select the new cross and display it
      this.dropOpen = true;
      this.changeView(cn);

      // change to the Crosses View
      this.cntrl.changeView(2);
      document.getElementById("selCrossView").focus();
      document.getElementById("messages2").textContent = "The female and male flies have been mated. Cross " + cn + " has been added to the crosses view.";
   }

   // function to create a fly entry for the Crosses View
  this.createFlyCell = function(flyNum) {
      var cn = this.cntrl.numCrosses;
      var fly = this.cntrl.fliesCr[cn-1][flyNum];
      var idLbl = "Fly" + flyNum + "Cr" + cn;
      var magIdLbl = '"mag' + idLbl + '"';
      var flyCell = "<div class='fly'><span tabindex='0'>" + fly.phenoString + "; ";
	  flyCell = flyCell + "<span aria-hidden='true'>N&nbsp;=&nbsp;" + fly.repNum + "</span><span class='visually-hidden'>Number = " + fly.repNum + "</span></span><br>";
      flyCell = flyCell + "<canvas role='img' tabindex='0' class='crossFlyCnvs' id='cnv" + idLbl + "' width='180px' height='180px'></canvas><br>";
      flyCell = flyCell + "<button type='button' class='magnify-small' title='magnify fly image' aria-label='magnify fly image' id='mag" + idLbl + "' onclick='cntrl.magFly(cntrl.magCnv,cntrl.fliesCr[" + (cn-1) + "][" + flyNum + "]," + magIdLbl + ")'><img src='img/magnify.png' style='width:18px; height:18px; vertical-align:middle;'></button>&nbsp;&nbsp;";
      flyCell = flyCell + "<button type='button' class='select-small' id='sel"  + idLbl + "' onclick='mv.selectFly(1,[" + flyNum + "," + cn + "])'>Select to Mate</button></div>";
      return flyCell;
   }

   // function to select a fly
   this.selFly = function(flyNum, cn) {
      var fly = this.cntrl.fliesCr[cn-1][flyNum];
      var ctx = document.getElementById("cnvFly" + flyNum + "Cr" + cn).getContext("2d");
      ctx.drawImage(this.chkmk, 40, 40);  // draw check mark
      if (fly.isMale) {
         this.mFlySelect = [flyNum, cn];
      } else {
         this.fFlySelect = [flyNum, cn];
      }
   }

   // function to unselect a fly
   this.unselFly = function(flyNum, cn) {
      var fly = this.cntrl.fliesCr[cn-1][flyNum];
      var cnv = document.getElementById("cnvFly" + flyNum + "Cr" + cn);
      this.cntrl.fliesCr[cn-1][flyNum].drawFly(cnv, 1.5);  // redraw selected fly
      if (fly.isMale) {
         this.mFlySelect = [0, 0];
      } else {
         this.fFlySelect = [0, 0];
      }
   }
}