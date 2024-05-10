function Phenotype(aGenotype) {
   this.genotypes = [aGenotype];
   this.isMale = aGenotype.isMale;
   this.phenoChars = aGenotype.phenoChars;
   this.phenoCode = aGenotype.phenoCode;
   this.numTraits = aGenotype.numTraits;
   this.phenoString = "";
   this.phenoDescr = "";
   this.prob = aGenotype.prob;
   this.repNum = 1;
   this.source = "";

   // function for setting the phenoString
   this.makePhenoString = function() {
      var i = 0;
      var abbrevs = [["F", "SV", "SN", "SS", "SB"], // bristles
                     ["AR"],                        // antennae
                     ["BW", "PR", "SE", "W"],       // eye colors
                     ["B", "EY", "L", "ST"],        // eye shapes
                     ["AP", "M", "VG"],             // wing sizes
                     ["CY", "C", "DP", "SD"],       // wing shapes
                     ["CV", "RI"],                  // wing veins
                     ["D"],                         // wing angle
                     ["BL", "E", "S", "T", "Y"]];   // body colors

      var descrs = [["forked bristles", "shaven bristles", "singed bristles", "spineless bristles", "stubble bristles"],
                     ["aristapedia antennae"],
                     ["brown eyes", "purple eyes", "sepia eyes", "white eyes"],
                     ["bar eyes", "no eyes", "lobe eyes", "star eyes"],
                     ["apterous wings", "miniature wings", "vestigial wings"],
                     ["curly wings", "curved wings", "dumpy wings", "scalloped wings"],
                     ["crossveinless wings", "incomplete wings veins"],
                     ["dichaete wing angle"],
                     ["black body color", "ebony body color", "sable body color", "tan body color", "yellow body color"]];

      // sex
      if (this.isMale) {
         this.phenoString = "Male: ";
         this.phenoDescr = "male fly with ";
      } else {
         this.phenoString = "Female: ";
         this.phenoDescr = "female fly with ";
      }

      // mutations
      if (this.phenoCode < 2) {
         this.phenoString = this.phenoString + "+";  // wild type
         this.phenoDescr = this.isMale ? "male wild type fly" : "female wild type fly";
         this.phenoString = "<span aria-hidden='true'><abbr title='" + this.phenoDescr + "'>" + this.phenoString + "</abbr></span><span class='visually-hidden'>" + this.phenoDescr + "</span>";
      } else {
         for (i=1; i<10; i++) {
            if (this.phenoChars[i] > 0) {   // not wild type
               this.phenoString = this.phenoString + abbrevs[i-1][this.phenoChars[i]-1] + ", ";
               this.phenoDescr = this.phenoDescr + descrs[i-1][this.phenoChars[i]-1] + ", ";
            }
         }
        // remove last space and comma
        this.phenoString = this.phenoString.substr(0, this.phenoString.length-2);
        this.phenoDescr = this.phenoDescr.substr(0, this.phenoDescr.length-2);

        // add abbr tag and aria-label tag to html version for text display
        this.phenoString = "<span aria-hidden='true'><abbr title='" + this.phenoDescr + "'>" + this.phenoString + "</abbr></span><span class='visually-hidden'>" + this.phenoDescr + "</span>";
      }
   }

   // reset the phenoString
   this.makePhenoString();

   // add a genotype and add to the probability
   this.addGenotype = function(aGenotype) {
      this.genotypes.push(aGenotype);   // add to array of genotypes
      this.prob = this.prob + aGenotype.prob;
   }

   // pick a genotype at random
   this.pickGenotype = function() {
      var aGenotype;
      var aRand = Math.random();
      var i = 0, totProb = 0.0, testProb = 0.0;

      // compute total probability
      for (i=0; i<this.genotypes.length; i++) {
         totProb = totProb + this.genotypes[i].prob;
      }

      // make a random pick
      for (i=0; i<this.genotypes.length; i++) {
         testProb = testProb + this.genotypes[i].prob/totProb;
         if (aRand < testProb) {
            aGenotype = this.genotypes[i];
            break;
         }
      }
      return aGenotype;
   }

   // clear context from drawing
   this.clearFly = function(ctx, sc) {
      ctx.scale(sc, sc);
      ctx.beginPath();
      ctx.rect(0, 0, 120, 120);
      ctx.fillStyle = "white";
      ctx.fill();
      ctx.scale(1/sc, 1/sc);
   }

   // draw fly in canvas context at scale (1 = 120x120 px)
   this.drawFly = function(cnv, sc) {
      var ctx = cnv.getContext("2d");
      this.clearFly(ctx, sc);
      ctx.scale(sc, sc);
      var bodyColors = ["#D98D39", "#1A0A03", "#4D2105", "#291203", "#E3CFB5", "#C9C900"];
      var eyeColors = ["#D1053D", "#996633", "#B300B3", "#1C1F00", "#FFE7E6"];
      var bType = this.phenoChars[1];  // type of bristle
      var isArista = (this.phenoChars[2] == 1) ? true : false;  // antennae
      var ec = eyeColors[this.phenoChars[3]];   // eye color
      var eType = this.phenoChars[4];  // type of eye shape
      var wsize = this.phenoChars[5];  // wing size
      var wshape = this.phenoChars[6];   // wing shape
      var wvein = this.phenoChars[7];   // wing vein
      var wangle = this.phenoChars[8];   // wing angle
      var bc = bodyColors[this.phenoChars[9]];   // body color
      drawFrontLegs(ctx, bc, this.isMale);
      drawMiddleLegs(ctx, bc);
      drawRearLegs(ctx, bc);
      drawAbdomen(ctx, bc, this.isMale);
      drawThorax(ctx, bc, bType);
      drawHeadEyes(ctx, bc, ec, eType);
      drawAntennae(ctx, bc, isArista);
      drawWings(ctx, wsize, wshape, wvein, wangle);
      ctx.scale(1/sc, 1/sc);
      cnv.setAttribute("role", "img");
      cnv.setAttribute("aria-label", this.phenoDescr);
      cnv.setAttribute("title", this.phenoDescr);
   }

   // clone it
   this.clone = function() {
      var theGenotypes = [];
      var i;

      // create new phenotype
      var meClone = new Phenotype(this.genotypes[0].clone());

      // add other genotypes, if any
      for (i=1; i<this.genotypes.length; i++) {
         meClone.addGenotype(this.genotypes[i].clone());
      }

      // copy the rep number and source
      meClone.repNum = this.repNum;
      meClone.source = this.source;

      return meClone;
   }
}