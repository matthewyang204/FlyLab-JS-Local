function DesignView() {

   // button labels for trait groups
   this.desLbls = [["Sex", "Bristles", "Antennae", "Eye Color", "Eye Shape", "Wing Size",
                    "Wing Shape", "Wing Veins", "Wing Angle", "Body Color"],
                   ["Se<u>x</u>", "<u>B</u>ristles", "An<u>t</u>ennae", "<u>E</u>ye Color", "Eye S<u>h</u>ape",
                    "Wing Si<u>z</u>e", "<u>W</u>ing Shape", "Wing <u>V</u>eins", "Wing A<u>n</u>gle", "Body C<u>o</u>lor"]];

   // trait strings for table
   this.traitStrs = [["female <span aria-hidden='true'>(&#9792;)</span>", "male <span aria-hidden='true'>(&#9794;)</span>"],
                     ["wild type <span aria-hidden='true'>(+)</span>", "forked <span aria-hidden='true'>(F)</span>", "shaven <span aria-hidden='true'>(SV)</span>", "singed <span aria-hidden='true'>(SN)</span>", "spineless <span aria-hidden='true'>(SS)</span>", "stubble <span aria-hidden='true'>(SB)</span>"],
                     ["wild type <span aria-hidden='true'>(+)</span>", "aristapedia <span aria-hidden='true'>(AR)</span>"],
                     ["wild type <span aria-hidden='true'>(+)</span>", "brown <span aria-hidden='true'>(BW)</span>", "purple <span aria-hidden='true'>(PR)</span>", "sepia <span aria-hidden='true'>(SE)</span>", "white <span aria-hidden='true'>(W)</span>"],
                     ["wild type <span aria-hidden='true'>(+)</span>", "bar <span aria-hidden='true'>(B)</span>", "eyeless <span aria-hidden='true'>(EY)</span>", "lobe <span aria-hidden='true'>(L)</span>", "star <span aria-hidden='true'>(S)</span>"],
                     ["wild type <span aria-hidden='true'>(+)</span>", "apterous <span aria-hidden='true'>(AP)</span>", "miniature <span aria-hidden='true'>(M)</span>", "vestigial <span aria-hidden='true'>(VG)</span>"],
                     ["wild type <span aria-hidden='true'>(+)</span>", "curly <span aria-hidden='true'>(CY)</span>", "curved <span aria-hidden='true'>(C)</span>", "dumpy <span aria-hidden='true'>(DP)</span>", "scalloped <span aria-hidden='true'>(SD)</span>"],
                     ["wild type <span aria-hidden='true'>(+)</span>", "crossveinless <span aria-hidden='true'>(CV)</span>", "incomplete <span aria-hidden='true'>(RI)</span>"],
                     ["wild type <span aria-hidden='true'>(+)</span>", "dichaete <span aria-hidden='true'>(D)</span>"],
                     ["wild type <span aria-hidden='true'>(+)</span>", "black <span aria-hidden='true'>(BL)</span>", "ebony <span aria-hidden='true'>(E)</span>", "sable <span aria-hidden='true'>(S)</span>", "tan <span aria-hidden='true'>(T)</span>", "yellow <span aria-hidden='true'>(Y)</span>"]];

   // number of options in each trait group
   this.nOptns = [2, 6, 2, 5, 5, 4, 5, 3, 2, 6];

   // radio button group names
   this.rdBtns = ["sex", "bristle", "ant", "ecolor", "eshape", "wsize", "wshape", "wvein", "wangle", "bcolor"];

   // function for setting up UI stuff
   this.setup = function(cntrl, views) {																

      // the various main views
      this.cntrl = cntrl;
      this.mv = views[1];
      this.cv = views[2];
      this.av = views[3];
      this.lv = views[4];

      // trait divs and buttons
      this.trtImgs = document.getElementsByClassName("trtImg");
      this.traitsBtn = document.getElementsByClassName("traitsBtn");
      this.activeView = 0;

      // make the sex group the selected group, hide others
      this.groupSel = 0;
       for (i = 9; i >= 0; i--) {
          this.changeGroup(i);
          if (i > 0) {
             this.traitsBtn[i].children[0].rows[0].cells[1].style.display = "none";
          }
       }

       // draw fly in the Design View
       this.dCnv = document.getElementById("designCnv");
       this.dFly = new Phenotype(new Genotype(null, null));
       this.dFly.source = "Design View";
       this.dFly.drawFly(this.dCnv, 2.916667);
   }

   // function to change the mutation group in the Design View
   this.changeGroup = function(groupNo) {
      var nOptions = this.nOptns[groupNo];
      var nOptAvail = nOptions;
      if (groupNo != this.groupSel) {
         this.traitsBtn[this.groupSel].setAttribute("class", "traitsBtn");
         this.trtImgs[this.groupSel].style.display = "none";
         this.traitsBtn[this.groupSel].children[0].rows[0].cells[0].innerHTML = this.desLbls[1][this.groupSel];
         this.groupSel = groupNo;
         this.traitsBtn[this.groupSel].setAttribute("class", "traitsBtn active");
         this.trtImgs[this.groupSel].style.display = "block";
         this.traitsBtn[this.groupSel].children[0].rows[0].cells[0].innerHTML = this.desLbls[0][this.groupSel];
         if (cntrl.activeView == 0) {
            this.traitsBtn[groupNo].focus();
         } else {
            this.traitsBtn[groupNo].blur();
         }
         var i = 0;
         for (i=0; i<nOptions; i++) {
            if (dv.trtImgs[groupNo].children[0].rows[0].cells[i].style.display==="none") {
               nOptAvail--;
            }
         }
	     if (cntrl.activeView == 0) {
			 document.getElementById("messages").textContent = this.desLbls[0][this.groupSel] + " options now available. " + "There are " + nOptAvail + " options.";
		 }
      }
   }

   // function to change the fly mutations in Design View
   this.flyMut = function(pheno, group, mut, draw) {
      var geno = pheno.genotypes[0];
      geno.addTrait(group, mut);
      pheno.isMale = geno.isMale;
      pheno.phenoChars = geno.phenoChars;
      pheno.phenoCode = geno.phenoCode;
      pheno.makePhenoString();
      if (group == 0) {
         this.traitsBtn[group].children[0].rows[0].cells[1].innerHTML = (mut == 0) ? "&#9792;" : "&#9794;";
      } else {
         this.traitsBtn[group].children[0].rows[0].cells[1].style.display = (mut == 0) ? "none" : "inline";
      }
      if (draw) {
         pheno.drawFly(this.dCnv, 2.916667);
         if (cntrl.activeView == 0) {
		    document.getElementById("messages").textContent = "designed fly is " + pheno.phenoDescr;
		 }
      }
      document.getElementById("traitsTbl").rows[group+1].cells[1].innerHTML = this.traitStrs[group][mut];
      // change the selected radio button
      var rdBtns = document.getElementsByName(this.rdBtns[group]);
      var i = 0;
      for (i=0; i<this.nOptns[group]; i++) {
         rdBtns[i].setAttribute("aria-selected", "false");
      }
         rdBtns[mut].setAttribute("aria-selected", "true");
   }

   // function to reset all traits in Design View
   this.resetAll = function() {
      var i = 0;
      for (i = 1; i <= 9; i++) {
         this.flyMut(this.dFly, i, 0, false);
         this.trtImgs[i].children[0].rows[1].cells[0].children[0].checked = true;
      }
      this.dFly.drawFly(this.dCnv, 2.916667);
      this.changeGroup(0);
      if (cntrl.activeView == 0) {
		  document.getElementById("messages").textContent = "All traits reset to wild type. Focus is back to the sex button.";
	  }
   }

   // function to set mutation options in Design View based on MateView
   this.mutOptions = function() {
      this.resetMuts();
      if ((this.mv.fParentExists || this.mv.mParentExists) && !(this.mv.fParentExists && this.mv.mParentExists)) {
         // hide options for traits present on existing parent
         var phCh = (this.mv.fParentExists) ? this.mv.fParent.phenoChars : this.mv.mParent.phenoChars;
         if (phCh[0] == 1) {  // remove sex option
            this.trtImgs[0].children[0].rows[0].cells[1].style.display = "none";
            this.trtImgs[0].children[0].rows[1].cells[1].style.display = "none";
            this.trtImgs[0].children[0].rows[1].cells[0].children[0].checked = true;
            this.flyMut(this.dFly,0,0,true);
         } else {
            this.trtImgs[0].children[0].rows[0].cells[0].style.display = "none";
            this.trtImgs[0].children[0].rows[1].cells[0].style.display = "none";
            this.trtImgs[0].children[0].rows[1].cells[1].children[0].checked = true;
            this.flyMut(this.dFly,0,1,true);
         }
         for (i=1; i<10; i++) {
            for (j=1; j < this.nOptns[i]; j++) {
               if ((phCh[i] > 0) && (j != phCh[i])) {
                  dv.trtImgs[i].children[0].rows[0].cells[j].style.display = "none";
                  dv.trtImgs[i].children[0].rows[1].cells[j].style.display = "none";
               }
            }
         }
      }
   }

   // function to design a fly
   this.designFly = function(sex) {
      var trtTbls = document.getElementsByClassName("traitsTbl");
      this.resetAll();
      this.cntrl.changeView(0);
      if (sex==0) {
         trtTbls[0].rows[1].cells[0].children[0].checked = true;
         this.flyMut(this.dFly,0,0,true);
      } else {
         trtTbls[0].rows[1].cells[1].children[0].checked = true;
         this.flyMut(this.dFly,0,1,true);
      }
   }

   // function to reset the all the available mutations in Design View
   this.resetMuts = function() {
      var i = 0, j = 0;
      for (i=1; i<10; i++) {
         for (j=1; j < this.nOptns[i]; j++) {
            this.trtImgs[i].children[0].rows[0].cells[j].style.display = "table-cell";
            this.trtImgs[i].children[0].rows[1].cells[j].style.display = "table-cell";
            this.trtImgs[i].children[0].rows[1].cells[j].children[0].checked = false;
         }
         this.flyMut(this.dFly,i,0,false);
      }
      this.resetAll();
      this.trtImgs[0].children[0].rows[0].cells[0].style.display = "table-cell";
      this.trtImgs[0].children[0].rows[1].cells[0].style.display = "table-cell";
      this.trtImgs[0].children[0].rows[0].cells[1].style.display = "table-cell";
      this.trtImgs[0].children[0].rows[1].cells[1].style.display = "table-cell";
      this.trtImgs[0].children[0].rows[1].cells[0].children[0].checked = true;
      this.flyMut(this.dFly,0,0,true);
   }
}
