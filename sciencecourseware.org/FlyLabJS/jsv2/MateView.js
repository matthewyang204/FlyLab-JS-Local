function MateView() {

   // the Mendel object for mating flies
   this.myMendel = new Mendel(1000);

   // parent phenotypes
   this.fParent = null;
   this.mParent = null;

   // indicator variables for Mate View
   this.fParentExists = false;
   this.mParentExists = false;

   // function for setting up UI stuff
   this.setup = function(cntrl, views) {

      // the various main views
      this.cntrl = cntrl;
      this.dv = views[0];
      this.cv = views[2];
      this.av = views[3];
      this.lv = views[4];

      // female and male canvas in Mate View
      this.fParentCnv = document.getElementById("fParentCnv");
      this.mParentCnv = document.getElementById("mParentCnv");
      this.fgreyfly = new Image();
      this.mgreyfly = new Image();
      this.fgreyfly.onload = function(){mv.fParentCnv.getContext("2d").drawImage(mv.fgreyfly, 0, 0)};
      this.mgreyfly.onload = function(){mv.mParentCnv.getContext("2d").drawImage(mv.mgreyfly, 0, 0)};
      this.fgreyfly.src = "img/femaleFlyGrey.png";
      this.mgreyfly.src = "img/maleFlyGrey.png";

      // hide magnify buttons
      document.getElementById("fParentMag").style.display = "none";
      document.getElementById("mParentMag").style.display = "none";
}

   // function to select a fly for the Mate View
   this.selectFly = function(src, pheno) {
      if (src == 1) {  // if source is cross, get fly from array
         var fc = pheno;
         var pheno = this.cntrl.fliesCr[fc[1]-1][fc[0]];
      }
      if (src == 0 || (src == 1 && (this.mParentExists || this.fParentExists) && !(this.mParentExists && this.fParentExists))) {
         document.getElementById("messages2").textContent = "A fly with the phenotype " + pheno.phenoDescr + " has been selected for mating.";
      } else if (!this.mParentExists && !this.fParentExists) {
         document.getElementById("messages2").textContent = "Main view is still the crosses view. A fly with the phenotype " + pheno.phenoDescr + " has been selected for mating.";
      }
      if ((!pheno.isMale && this.fParentExists) || (pheno.isMale && this.mParentExists)) {
		 if (confirm("A fly of this sex is already selected for mating. Do you want to replace it?.")) {
            if (src == 1 && (pheno.isMale ? this.mParent.source : this.fParent.source) != "Design View") {
               var oldSelFly = pheno.isMale ? this.cv.mFlySelect.slice(0,2) : this.cv.fFlySelect.slice(0,2);
               this.cv.unselFly(oldSelFly[0], oldSelFly[1]);
            }
			document.getElementById("messages2").textContent = "A fly with the phenotype " + pheno.phenoDescr + " has been selected for mating.";
         } else {
            return;
         }
      }
      if (src == 1) { // if source is cross, select fly
         this.cv.selFly(fc[0], fc[1]);
      }
      if (pheno.isMale) {
         this.mParent = new Phenotype(pheno.pickGenotype().clone());
         this.mParent.source = pheno.source;
         this.mParent.drawFly(this.mParentCnv, 2.916667);
         this.mParentExists = true;
         document.getElementById("mParentTxt").innerHTML = "";
         document.getElementById("mParentTxt").innerHTML = this.mParent.phenoString + "<br>Source: " + this.mParent.source;
         document.getElementById("mParentMag").style.display = "block";
         document.getElementById("mParentMag").setAttribute("aria-hidden", "false");
         document.getElementById("mDesRem").innerHTML = "Remo<u>v</u>e Fly";
         document.getElementById("mDesRem").setAttribute("onclick", "mv.removeFly(1)");
         document.getElementById("mDesRem").setAttribute("aria-label", "remove male fly from mating view");
      } else {
         this.fParent = new Phenotype(pheno.pickGenotype().clone());
         this.fParent.source = pheno.source;
         this.fParent.drawFly(this.fParentCnv, 2.916667);
         this.fParentExists = true;
         document.getElementById("fParentTxt").innerHTML = "";
         document.getElementById("fParentTxt").innerHTML = this.fParent.phenoString + "<br>Source: " + this.fParent.source;
         document.getElementById("fParentMag").style.display = "block";
         document.getElementById("fParentMag").setAttribute("aria-hidden", "false");
         document.getElementById("fDesRem").innerHTML = "<u>R</u>emove Fly";
         document.getElementById("fDesRem").setAttribute("onclick", "mv.removeFly(0)");
         document.getElementById("fDesRem").setAttribute("aria-label", "remove female fly from mating view");
      }
      // if in Design View, go to Mate View
      if (src == 0) {
         this.cntrl.changeView(1);
      } else {
         // if src is offspring view, go to Mate View only if ready to mate
         if ((!pheno.isMale && this.mParentExists) || (pheno.isMale && this.fParentExists)) {
            this.cntrl.changeView(1);
         }
      }
      // enable Mate button if two parents exist
      if (this.fParentExists && this.mParentExists) {
         var mateBtn = document.getElementById("mateBtn");
         mateBtn.disabled = false;
         mateBtn.setAttribute("aria-disabled", "false");
         mateBtn.setAttribute("aria-label", "mate the female and male flies");
		 mateBtn.focus();
      }
      // reset the Design View
      this.dv.mutOptions();
      this.dv.changeGroup(0);
   }

   // function to remove a fly from the Mate View  
   this.removeFly = function(sex) {
      if (sex==0) {
         this.fParent.clearFly(this.fParentCnv.getContext("2d"), 2.916667);
         fParentCnv.setAttribute("aria-label", "image of greyed out female fly");
         fParentCnv.setAttribute("title", "greyed out female fly");
         this.fParent = null;
         this.fParentCnv.getContext("2d").drawImage(this.fgreyfly, 0, 0);
         this.fParentExists = false;
         document.getElementById("messages").textContent = "The female fly has been removed from the Mate view .";
         document.getElementById("fParentTxt").innerHTML = "";
         document.getElementById("fParentTxt").innerHTML = "No Female";
         document.getElementById("fParentMag").style.display = "none";
         document.getElementById("fParentMag").setAttribute("aria-hidden", "true");
         document.getElementById("fDesRem").innerHTML = "D<u>e</u>sign Fly";
         document.getElementById("fDesRem").setAttribute("aria-label", "design a female fly for mating");
         document.getElementById("fDesRem").setAttribute("onclick", "dv.designFly(0)");
         if (this.cv.fFlySelect[1] > 0) {  // if selected from cross, deselect and redraw
            this.cv.unselFly(this.cv.fFlySelect[0], this.cv.fFlySelect[1]);
         }
         document.getElementById("fDesRem").focus();
      } else {
         this.mParent.clearFly(this.mParentCnv.getContext("2d"), 2.916667);
         this.mParent = null;
         this.mParentCnv.getContext("2d").drawImage(this.mgreyfly, 0, 0);
         mParentCnv.setAttribute("aria-label", "image of greyed out male fly");
         mParentCnv.setAttribute("title", "greyed out male fly");
         this.mParentExists = false;
         document.getElementById("messages").textContent = "The male fly has been removed from the Mate view .";
         document.getElementById("mParentTxt").innerHTML = "";
         document.getElementById("mParentTxt").innerHTML = "No Male";
         document.getElementById("mParentMag").style.display = "none";
         document.getElementById("mParentMag").setAttribute("aria-hidden", "true");
         document.getElementById("mDesRem").innerHTML = "De<u>s</u>ign Fly";
         document.getElementById("mDesRem").setAttribute("aria-label", "design a male fly for mating");
         document.getElementById("mDesRem").setAttribute("onclick", "dv.designFly(1)");
         if (this.cv.mFlySelect[1] > 0) {  // if selected from cross, deselect and redraw
            this.cv.unselFly(this.cv.mFlySelect[0], this.cv.mFlySelect[1]);
         }
         document.getElementById("mDesRem").focus();
      }
      // reset the Design View
      document.getElementById("sexBtn").setAttribute("aria-label", "");
      this.dv.mutOptions();
      this.dv.changeGroup(0);
      document.getElementById("sexBtn").setAttribute("aria-label", "options for sex of fly");

      // disable Mate button
      var mateBtn = document.getElementById("mateBtn");
      mateBtn.disabled = true;
      mateBtn.setAttribute("aria-disabled", "true");
      mateBtn.removeAttribute('aria-label');

      // screen reader
      document.getElementById("messages").textContent = "The " + (sex==0 ? "female" : "male") + " fly has been removed from the Mate view. This button function changed to design " + (sex==0 ? "female" : "male") + " fly.";
   }

   // function to mate parent flies
   this.mateFlies = function() {
      var flies;
      if (this.fParentExists && this.mParentExists) {
         flies = this.myMendel.mate(this.fParent, this.mParent);
         if (flies !== -1 && flies !== -2 && flies !== -3) {
            // add the new phenotype array
            this.cntrl.fliesCr.push(flies);
            // increase the cross number
            this.cntrl.numCrosses++;
            // if first cross, unhide controls in Cross and Analyze Views
            if (this.cntrl.numCrosses == 1) {
               document.getElementById("cvDropdown").style.display = "inline-block";
               document.getElementById("avDropdown").style.display = "inline-block";
               document.getElementById("avChbxSexDiv").style.display = "inline-block";
               document.getElementById("avChbxHypDiv").style.display = "inline-block";
            }
            // remove parent flies from Mate View
            this.removeFly(0);
            this.removeFly(1);
            // disable the Mate button
            document.getElementById("mateBtn").disabled = true;
            // reset the Design View
            this.dv.mutOptions();
            this.dv.changeGroup(0);
            // add cross to Analyze View
            this.av.addCross(flies);
            // add cross to Cross View
            this.cv.addCross(flies);
         }
      } else {
         alert("You need two flies to mate.");
      }
   }

}