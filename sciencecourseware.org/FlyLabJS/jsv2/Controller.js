function Controller() {

   // number of crosses
   this.numCrosses = 0;

   // modal view open flag
   this.modalView = false;

   // magnified fly
   this.theMagFly = null;

   // array of phenotype arrays for crosses
   this.fliesCr = [];

   // tab labels for the views
   this.tabLbls = [["Design", "Mate", "Crosses", "Analyze", "Lab Notes"],
                   ["<span class='visually-hidden'>Design</span><span aria-hidden='true'><u>D</u>esign</span>", "<span class='visually-hidden'>Mate</span><span aria-hidden='true'><u>M</u>ate</span>", "<span class='visually-hidden'>Crosses</span><span aria-hidden='true'><u>C</u>rosses</span>", "<span class='visually-hidden'>Analyze</span><span aria-hidden='true'><u>A</u>nalyze</span>", "<span class='visually-hidden'>Lab Notes</span><span aria-hidden='true'><u>L</u>ab Notes</span>"]];

   // function for setting up UI stuff
   this.setup = function(views) {

      // the various main views
      this.dv = views[0];
      this.mv = views[1];
      this.cv = views[2];
      this.av = views[3];
      this.lv = views[4];

      // arrays of tabs and views
      var i = 0;
      this.views = document.getElementsByClassName("tabcontent");
      this.tabs = document.getElementsByClassName("tab");
      this.activeView = 0;
      for (i = 4; i >= 0; i--) {
         this.changeView(i);
      }

      // modal view for magniflying a fly
      this.magView = document.getElementById("magView");

      // modal context for magniflying a fly
      this.magCnv = document.getElementById("magCnv");

      // activated magnify fly button
      this.magBtn = document.getElementById("dvMag");

      // offscreen <p> for messages
      this.message = document.getElementById("messages");

   }

   // function to change the active view
   this.changeView = function(viewNo) {
      if (viewNo != this.activeView) {
         this.tabs[this.activeView].blur();
         this.tabs[this.activeView].setAttribute("class", "tab");
         this.tabs[this.activeView].setAttribute("aria-selected", "false");
         this.views[this.activeView].style.display = "none";
         this.tabs[this.activeView].innerHTML = this.tabLbls[1][this.activeView];
         this.activeView = viewNo;
         this.tabs[this.activeView].setAttribute("class", "tab active");
         this.tabs[this.activeView].setAttribute("aria-selected", "true");
         this.views[this.activeView].style.display = "block";
         this.tabs[this.activeView].innerHTML = this.tabLbls[0][this.activeView];
         this.tabs[this.activeView].click();
      }
      // scroll to top for Cross and Analyze Views
      if (viewNo > 1 && viewNo < 4) {
         document.getElementsByClassName("cvAvCntnt")[viewNo-2].scrollTop = 0;
      }
      // announce change of view for screen reader
      switch (viewNo) {
         case 0:  // set focus to selected button in Design View
            this.dv.traitsBtn[dv.groupSel].focus();
            document.getElementById("messages").textContent = "The main view has been changed to the design fly view. Focus is on " + dv.desLbls[0][dv.groupSel] + " button.";
         break;
         case 1:
            if (!this.mv.mParentExists && !this.mv.fParentExists) {
               document.getElementById("messages").textContent = "The main view is now the mate flies view. No flies have been selected for mating.";
			   document.getElementById("fDesRem").focus();
            } else if (this.mv.mParentExists && !this.mv.fParentExists) {
               document.getElementById("messages").textContent = "The main view is now the mate flies view. A male fly has been selected for mating.";
			   document.getElementById("fDesRem").focus();
            } else if (!this.mv.mParentExists && this.mv.fParentExists) {
               document.getElementById("messages").textContent = "The main view is now the mate flies view. A female fly has been selected for mating.";
			   document.getElementById("mDesRem").focus();

            } else {
               document.getElementById("messages").textContent = "The main view is now the mate flies view. Both a male and a female fly have been selected for mating.";
			   document.getElementById("mateBtn").focus();
            }
         break;
         case 2:
            if (this.numCrosses > 0) {
               document.getElementById("selCrossView").focus();
               document.getElementById("messages").textContent = "The main view is now the crosses view. Focus is on the select cross button.";
            } else {
               document.getElementById("messages").textContent = "The main view is now the crosses view. There are no crosses.";
            }
         break;
         case 3:
            if (this.numCrosses > 0) {
               document.getElementById("selAnalyzeView").focus();
               document.getElementById("messages").textContent = "The main view is now the analyze view. Focus is on the select cross button.";
            } else {
               document.getElementById("messages").textContent = "The main view is now the analyze view. There are no crosses.";
            }
         break;
         case 4:
            document.getElementById("messages").textContent = "The main view has been changed to the lab notes view.";
         break;
      }
   }

   // function to magnify a fly image
   this.magFly = function(cnv, pheno, actvMagBtn) {
      this.magBtn = document.getElementById(actvMagBtn);
      this.theMagFly = pheno;
      this.magView.style.display = "block";
      this.modalView = true;
      document.getElementById("closeBtn").focus();
      pheno.drawFly(cnv, 5.2);
      document.getElementById("messages").textContent = "Magnified pop up view of the fly. Focus is on the close button.";
      document.getElementById("messages2").textContent = "Magnified fly is " + pheno.phenoDescr;
   }

   // function to close the magnify view
   this.closeMagView = function() {
      this.theMagFly = null;
      this.magView.style.display = "none";
      this.modalView = false;
      document.getElementById("messages").textContent = "The magnified pop up view of the fly has closed.";
      this.magBtn.focus();
   }

   this.keybShortCuts = function(c) {
      // keyboard shortcuts
      window.addEventListener('keydown', function (e){
         var acEl = document.activeElement;
         var mKeys = [39,37,68,77,67,65,76];
         var avKeys = [88,72,84,78,82];
         var cvOptns = document.getElementById("crossesDropDown").children;
         var avOptns = document.getElementById("analyzeDropDown").children;
         if (!(acEl.tagName=="TEXTAREA" || (c.activeView > 0 && acEl.tagName=="INPUT" && e.keyCode != 38 && e.keyCode != 40))) {
            if (c.modalView) {
               var isTabPressed = (e.key === 'Tab' || e.keyCode === 9);
               var closeBtn = document.getElementById("closeBtn");
               var exprtBtn = document.getElementById("exprtBtn");
               if (isTabPressed) {
                  if ( e.shiftKey ) {   // shift + tab
                     if (document.activeElement === closeBtn) {
                         exprtBtn.focus();
                         e.preventDefault();
                     }
                  } else {   // tab
                     if (document.activeElement === exprtBtn) {
                         closeBtn.focus();
                         e.preventDefault();
                     }                  
                  }
                  return;
               }
               switch (e.keyCode) {
                    case 73:   // i or I
                        c.lv.addFlyToNotes(c.theMagFly);
                        break;
                    case 88:   // x or X
                        c.closeMagView();
                        break;
               }
            } else if (mKeys.includes(e.keyCode)) {
               switch (e.keyCode) {
                    case 39:   // right
                        if (document.activeElement.getAttribute("type") != "radio") {
                           c.changeView((c.activeView==4) ? 0 : c.activeView+1);
                        }
                        break;
                    case 37:   // left
                        if (document.activeElement.getAttribute("type") != "radio") {
                           c.changeView((c.activeView==0) ? 4 : c.activeView-1);
                        }
                        break;
                    case 100:   // d or D
                    case 68:
                        c.changeView(0);
                        break;
                    case 109:   // m or M
                    case 77:
                        c.changeView(1);
                        break;
                    case 99:   // c or C
                    case 67:
                        c.changeView(2);
                        break;
                    case 97:   // a or A
                    case 65:
                        c.changeView(3);
                        break;
                    case 108:   // l or L
                    case 76:
                        c.changeView(4);
                        break;
               }
            } else if (acEl.id == "selCrossView" || document.getElementById("crossesDropDown").contains(acEl)) {
               var cvBtns = document.getElementById("crossesDropDown").children;
               switch (e.keyCode) {
                    case 38:   // up
                         if (!c.cv.dropOpen) {
                            c.cv.openList();
                            cvBtns[cvBtns.length-1].focus();
                         } else if (acEl.id == "selCrossView") {
                            cvBtns[cvBtns.length-1].focus();
                         } else {
                            acEl === document.getElementById("crossesDropDown").firstChild ? cvBtns[cvBtns.length-1].focus() : acEl.previousSibling.focus();
                         }
                         e.preventDefault();
                        break;
                    case 40:   // down
                         if (!c.cv.dropOpen) {
                            c.cv.openList();
                            cvBtns[0].focus();
                         } else if (acEl.id == "selCrossView") {
                            cvBtns[0].focus();
                         } else {
                            acEl === document.getElementById("crossesDropDown").lastChild ? cvBtns[0].focus() : acEl.nextSibling.focus();
                         }
                         e.preventDefault();
                        break;
                    case 36:   // home
                         if (c.cv.dropOpen) {
                            cvBtns[0].focus();
                         }
                        break;
                    case 35:   // end
                         if (c.cv.dropOpen) {
                            cvBtns[cvBtns.length-1].focus();
                         }
                        break;
                    case 27:   // escape
                        if (c.cv.dropOpen) {
                           c.cv.openList();
                           c.cv.selCrBut.focus();
                        }
                        break;
                    case 83:   // s or S
                        c.cv.selCrBut.click();
                        c.cv.selCrBut.focus();
                        break;
               }
            } else if ((acEl.id == "selAnalyzeView" || document.getElementById("analyzeDropDown").contains(acEl)) && !avKeys.includes(e.keyCode)) {
               var avBtns = document.getElementById("analyzeDropDown").children;
               switch (e.keyCode) {
                    case 38:   // up
                         if (!c.av.dropOpen) {
                            c.av.openList();
                            avBtns[avBtns.length-1].focus();
                         } else if (acEl.id == "selAnalyzeView") {
                            avBtns[avBtns.length-1].focus();
                         } else {
                            acEl === document.getElementById("analyzeDropDown").firstChild ? avBtns[avBtns.length-1].focus() : acEl.previousSibling.focus();
                         }
                         e.preventDefault();
                        break;
                    case 40:   // down
                         if (!c.av.dropOpen) {
                            c.av.openList();
                            avBtns[0].focus();
                         } else if (acEl.id == "selAnalyzeView") {
                            avBtns[0].focus();
                         } else {
                            acEl === document.getElementById("analyzeDropDown").lastChild ? avBtns[0].focus() : acEl.nextSibling.focus();
                         }
                         e.preventDefault();
                        break;
                    case 36:   // home
                         if (c.av.dropOpen) {
                            avBtns[0].focus();
                         }
                        break;
                    case 35:   // end
                         if (c.av.dropOpen) {
                            avBtns[avBtns.length-1].focus();
                         }
                        break;
                    case 27:   // escape
                        if (c.av.dropOpen) {
                           c.av.openList();
                           c.av.selCrBut.focus();
                        }
                        break;
                    case 83:   // s or S
                        c.av.selCrBut.click();
                        c.av.selCrBut.focus();
                        break;
               }
            } else {
               if (c.activeView == 0) {
                  switch (e.keyCode) {
                     case 88:   // x or X
                         c.dv.changeGroup(0);
                         break;
                     case 66:   // b or B
                         c.dv.changeGroup(1);
                         break;
                     case 84:   // t or T
                         c.dv.changeGroup(2);
                         break;
                     case 69:   // e or E
                         c.dv.changeGroup(3);
                         break;
                     case 72:   // h or H
                         c.dv.changeGroup(4);
                         break;
                     case 90:   // z or Z
                         c.dv.changeGroup(5);
                         break;
                     case 87:   // w or W
                         c.dv.changeGroup(6);
                         break;
                     case 86:   // v or V
                         c.dv.changeGroup(7);
                         break;
                     case 78:   // n or n
                         c.dv.changeGroup(8);
                         break;
                     case 79:   // o or O
                         c.dv.changeGroup(9);
                         break;
                     case 82:   // r or R
                         c.dv.resetAll();
                         break;
                     case 83:   // s or S
                         c.mv.selectFly(0, c.dv.dFly)
                         break;
                     case 71:   // g or G
                         c.magFly(c.magCnv, c.dv.dFly);
                         break;
                     case 48:   // 0 - 5
                     case 96:
                     case 49:
                     case 97:
                     case 50:
                     case 98:
                     case 51:
                     case 99:
                     case 52:
                     case 100:
                     case 53:
                     case 101:
                         var trtTbls = document.getElementsByClassName("traitsTbl");
			 var kCode = e.keyCode;
			 if (kCode < 96) {
			    kCode = kCode - 48;
			 } else {
			    kCode = kCode - 96;
                         }
                         if ( kCode < c.dv.nOptns[c.dv.groupSel]) {
                            if (!(window.getComputedStyle(c.dv.trtImgs[c.dv.groupSel].children[0].rows[1].cells[kCode]).display === "none")) {
                               trtTbls[c.dv.groupSel].rows[1].cells[kCode].children[0].click();
                               trtTbls[c.dv.groupSel].rows[1].cells[kCode].children[0].focus();
                               c.dv.flyMut(c.dv.dFly,c.dv.groupSel,kCode,true);
                            }
                         }
                         break;
                  }
               } else if (c.activeView == 1) {
                  switch (e.keyCode) {
                       case 70:   // f or F
                           c.mv.mateFlies();
                           break;
                       case 69:   // e or E
                           if (!c.mv.fParentExists) {
                              document.getElementById("fDesRem").click();
                           }
                           break;
                       case 82:   // r or R
                           if (c.mv.fParentExists) {
                              document.getElementById("fDesRem").click();
                           }
                           break;
                       case 83:   // s or S
                           if (!c.mv.mParentExists) {
                              document.getElementById("mDesRem").click();
                           }
                           break;
                       case 86:   // v or V
                           if (c.mv.mParentExists) {
                              document.getElementById("mDesRem").click();
                           }
                           break;
                  }
               } else  if (c.activeView == 2 && c.numCrosses > 0) {
                  switch (e.keyCode) {
                       case 83:   // s or S
                           c.cv.selCrBut.click();
                           c.cv.selCrBut.focus();
                           break;
                  }
               } else if (c.activeView == 3 && c.numCrosses > 0) {
                  switch (e.keyCode) {
                       case 83:   // s or S
                           c.av.selCrBut.click();
                           c.av.selCrBut.focus();
                           break;
                       case 88:   // x or X
                           c.av.chkButIgSex.click();
                           c.av.chkButIgSex.focus();
                           break;
                       case 72:   // h or H
                           c.av.chkButHyp.click();
                           c.av.chkButHyp.focus();
                           break;
                       case 84:   // t or T
                           var avDd = c.av.dropDisplayed-1;
                           var avIgSx = c.av.igSexOptions[avDd];
                           if ((avIgSx ? c.av.hypOptionsIgSx[avDd] : c.av.hypOptions[avDd]) && !(avIgSx ? c.av.hypTestedIgSx[avDd] : c.av.hypTested[avDd])) {
                              c.av.testHyp(avDd+1, avIgSx);
                           } 
                           break;
                       case 78:   // n or N
                           var avDd = c.av.dropDisplayed-1;
                           var avIgSx = c.av.igSexOptions[avDd];
                           if ((avIgSx ? c.av.hypOptionsIgSx[avDd] : c.av.hypOptions[avDd]) && (avIgSx ? c.av.hypTestedIgSx[avDd] : c.av.hypTested[avDd])) {
                              c.av.newHyp(avDd+1, avIgSx);
                           } 
                           break;
                       case 82:   // r or R
                           c.lv.addRes(c.av.dropDisplayed);
                           break;
					   case 38:   // up
					   case 40:   // down
                           if (acEl.tagName=="INPUT") {  
				               var avDd = c.av.dropDisplayed-1;
                               var avIgSx = c.av.igSexOptions[avDd];
                               var nFlds = (avIgSx ? c.av.dataIgSxCr[avDd].length : c.av.dataCr[avDd].length) - 2;
							   var fld = avIgSx ? Number(acEl.id.split("x")[1].split("C")[0]) : Number(acEl.id.split("l")[1].split("C")[0]);
							   if (e.keyCode == 38) {
								   var nxt = fld == 0 ? nFlds-1 : fld-1;
							   } else {
								   var nxt = fld == nFlds-1 ? 0 : fld+1;
							   }
							   if (avIgSx) {
								  document.getElementById("hypvalIgSx" + nxt + "Cr" + (avDd+1)).focus();
							   } else {
								  document.getElementById("hypval" + nxt + "Cr" + (avDd+1)).focus();
							   }
						   }
                           break;
                  }
               } else if (c.activeView == 4) {
                  switch (e.keyCode) {
                       case 69:   // e or E
                           c.lv.exportNotes();
                           break;
                  }
               }
            }
         }
      });
   }
}