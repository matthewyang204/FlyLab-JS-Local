function Genotype(anEgg, aSperm) {

   // chromosome-locus pairs for traits
   this.chromLoci = [[[1,9],[4,2],[1,4],[3,6],[3,5]],  // bristles
                     [[3,4]],                          // antennae
                     [[2,10],[2,5],[3,1],[1,2]],       // eye color
                     [[1,10],[4,1],[2,8],[2,1]],       // eye shape
                     [[2,6],[1,6],[2,7]],              // wing size
                     [[2,2],[2,9],[2,3],[1,8]],        // wing shape
                     [[1,3],[3,3]],                    // wing veins
                     [[3,2]],                          // wing angle
                     [[2,4],[3,7],[1,7],[1,5],[1,1]]]; // body color

   // if no egg or no sperm, make wild type female genotype
   if ((anEgg == null) || (aSperm == null)) {
      this.momsEgg = new Gamete(new Chromosome(1, false),
                        new Chromosome(2, false),
                        new Chromosome(3, false),
                        new Chromosome(4, false));
      this.dadsSperm = this.momsEgg.clone();
      this.prob = 1.0;
   } else {
   // get chromosomes from gametes
      this.momsEgg = anEgg;
      this.dadsSperm = aSperm;
      this.prob = anEgg.prob * aSperm.prob;
   }

   this.update = function() {
      var i=0, j=0, nLoci=0;
	
      // update the sex
      this.isMale = this.dadsSperm.chroms[0].isY;
	
      // count the number of heterozygous loci on each chromosome
      this.numHeteroLoci = [0, 0, 0, 0];
      for (i=0; i<4; i++) {
         nLoci = this.momsEgg.chroms[i].numLoci;
         for (j=0; j<nLoci; j++) {
            if (this.momsEgg.chroms[i].genes[j].isWT !== this.dadsSperm.chroms[i].genes[j].isWT) {
               this.numHeteroLoci[i]++;
            }
         }
      }

      // MAP GENES TO TRAITS
      // Array genoChars holds the character codes for traits on the
      // basis of the maternal (genoChars[0][]) and paternal (genoChars[1][])
      // chromosomes.  Array phenoChars holds the character codes for traits
      // on the basis of expression. Epistasis is taken into account below.

      this.genoChars = [[0,0,0,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,0,0,0]];
      this.phenoChars = [0,0,0,0,0,0,0,0,0,0];

      // Sex (trait 0)
      if (this.isMale) {
         this.genoChars[1][0] = 1;
         this.phenoChars[0] = 1;
      }	

      // Bristles (trait 1)
      bristles: {

         // forked (sex-linked recessive, chromosome I-X, locus 9)
         if (!this.momsEgg.chroms[0].genes[8].isWT) this.genoChars[0][1] = 1;
         if (!this.dadsSperm.chroms[0].genes[8].isWT) this.genoChars[1][1] = 1;
         if (this.genoChars[0][1]==1 && (this.isMale ||
               (!this.isMale && this.genoChars[1][1]==1))) this.phenoChars[1] = 1;
         if (this.genoChars[0][1]==1 || (!this.isMale && this.genoChars[1][1]==1)) break bristles;

         // shaven (autosomal recessive, chromosome IV, locus 2)
         if (!this.momsEgg.chroms[3].genes[1].isWT) this.genoChars[0][1] = 2;
         if (!this.dadsSperm.chroms[3].genes[1].isWT) this.genoChars[1][1] = 2;
         if (this.genoChars[0][1]==2 && this.genoChars[1][1]==2) this.phenoChars[1] = 2;
         if (this.genoChars[0][1]==2 || this.genoChars[1][1]==2) break bristles;

         // singed (sex-linked recessive, chromosome I-X, locus 4)
         if (!this.momsEgg.chroms[0].genes[3].isWT) this.genoChars[0][1] = 3;
         if (!this.dadsSperm.chroms[0].genes[3].isWT) this.genoChars[1][1] = 3;
         if (this.genoChars[0][1]==3 && (this.isMale ||
               (!this.isMale && this.genoChars[1][1]==3))) this.phenoChars[1] = 3;
         if (this.genoChars[0][1]==3 || (!this.isMale && this.genoChars[1][1]==3)) break bristles;

         // spineless (autosomal recessive, chromosome III, locus 6)
         if (!this.momsEgg.chroms[2].genes[5].isWT) this.genoChars[0][1] = 4;
         if (!this.dadsSperm.chroms[2].genes[5].isWT) this.genoChars[1][1] = 4;
         if (this.genoChars[0][1]==4 && this.genoChars[1][1]==4) this.phenoChars[1] = 4;
         if (this.genoChars[0][1]==4 || this.genoChars[1][1]==4) break bristles;

         // stubby (autosomal dominant and lethal, chromosome III, locus 5)
         if (!this.momsEgg.chroms[2].genes[4].isWT) this.genoChars[0][1] = 5;
         if (!this.dadsSperm.chroms[2].genes[4].isWT) this.genoChars[1][1] = 5;
         if (this.genoChars[0][1]==5 || this.genoChars[1][1]==5) this.phenoChars[1] = 5;
         if (this.genoChars[0][1]==5 && this.genoChars[1][1]==5) this.phenoChars[1] = -1; // lethal

      }  // end of bristles block

      // Antennae (trait 2)

      // aristapedia (autosomal dominant and lethal, chromosome III, locus 4)
      if (!this.momsEgg.chroms[2].genes[3].isWT) this.genoChars[0][2] = 1;
      if (!this.dadsSperm.chroms[2].genes[3].isWT) this.genoChars[1][2] = 1;
      if (this.genoChars[0][2]==1 || this.genoChars[1][2]==1) this.phenoChars[2] = 1;
      if (this.genoChars[0][2]==1 && this.genoChars[1][2]==1) this.phenoChars[2] = -1; // lethal

      // Eye Color (trait 3)
      eyeColor: {

         // brown (autosomal recessive, chromosome II, locus 10)
         if (!this.momsEgg.chroms[1].genes[9].isWT) this.genoChars[0][3] = 1;
         if (!this.dadsSperm.chroms[1].genes[9].isWT) this.genoChars[1][3] = 1;
         if (this.genoChars[0][3]==1 && this.genoChars[1][3]==1) this.phenoChars[3] = 1;
         if (this.genoChars[0][3]==1 || this.genoChars[1][3]==1) break eyeColor;

         // purple (autosomal recessive, chromosome II, locus 5)
         if (!this.momsEgg.chroms[1].genes[4].isWT) this.genoChars[0][3] = 2;
         if (!this.dadsSperm.chroms[1].genes[4].isWT) this.genoChars[1][3] = 2;
         if (this.genoChars[0][3]==2 && this.genoChars[1][3]==2) this.phenoChars[3] = 2;
         if (this.genoChars[0][3]==2 || this.genoChars[1][3]==2) break eyeColor;

         // sepia (autosomal recessive, chromosome III, locus 1)
         if (!this.momsEgg.chroms[2].genes[0].isWT) this.genoChars[0][3] = 3;
         if (!this.dadsSperm.chroms[2].genes[0].isWT) this.genoChars[1][3] = 3;
         if (this.genoChars[0][3]==3 && this.genoChars[1][3]==3) this.phenoChars[3] = 3;
         if (this.genoChars[0][3]==3 || this.genoChars[1][3]==3) break eyeColor;

         // white (sex-linked recessive, chromosome I-X, locus 2)
         if (!this.momsEgg.chroms[0].genes[1].isWT) this.genoChars[0][3] = 4;
         if (!this.dadsSperm.chroms[0].genes[1].isWT) this.genoChars[1][3] = 4;
         if (this.genoChars[0][3]==4 && (this.isMale ||
               (!this.isMale && this.genoChars[1][3]==4))) this.phenoChars[3] = 4;

      }  // end of eye color block

      // Eye Shape (trait 4)
      eyeShape: {

         // bar (sex-linked dominat, chromosome I-X, locus 10)
         if (!this.momsEgg.chroms[0].genes[9].isWT) this.genoChars[0][4] = 1;
         if (!this.dadsSperm.chroms[0].genes[9].isWT) this.genoChars[1][4] = 1;
         if (this.genoChars[0][4]==1 || (!this.isMale && this.genoChars[1][4]==1)) {
            this.phenoChars[4] = 1;
            break eyeShape;
         }

         // eyeless (autosomal recessive, chromosome IV, locus 1)
         if (!this.momsEgg.chroms[3].genes[0].isWT) this.genoChars[0][4] = 2;
         if (!this.dadsSperm.chroms[3].genes[0].isWT) this.genoChars[1][4] = 2;
         if (this.genoChars[0][4]==2 && this.genoChars[1][4]==2) this.phenoChars[4] = 2;
         if (this.genoChars[0][4]==2 || this.genoChars[1][4]==2) break eyeShape;

         // lobe (autosomal dominant, chromosome II, locus 8)
         if (!this.momsEgg.chroms[1].genes[7].isWT) this.genoChars[0][4] = 3;
         if (!this.dadsSperm.chroms[1].genes[7].isWT) this.genoChars[1][4] = 3;
         if (this.genoChars[0][4]==3 || this.genoChars[1][4]==3) {
            this.phenoChars[4] = 3;
            break eyeShape;
         }

         // star (autosomal dominant and lethal, chromosome II, locus 1)
         if (!this.momsEgg.chroms[1].genes[0].isWT) this.genoChars[0][4] = 4;
         if (!this.dadsSperm.chroms[1].genes[0].isWT) this.genoChars[1][4] = 4;
         if (this.genoChars[0][4]==4 || this.genoChars[1][4]==4) this.phenoChars[4] = 4;
         if (this.genoChars[0][4]==4 && this.genoChars[1][4]==4) this.phenoChars[4] = -1; // lethal

      }  // end of eye shape block

      // Wing Size (trait 5)
      wingSize: {

         // apterous (autosomal recessive, chromosome II, locus 6)
         if (!this.momsEgg.chroms[1].genes[5].isWT) this.genoChars[0][5] = 1;
         if (!this.dadsSperm.chroms[1].genes[5].isWT) this.genoChars[1][5] = 1;
         if (this.genoChars[0][5]==1 && this.genoChars[1][5]==1) this.phenoChars[5] = 1;
         if (this.genoChars[0][5]==1 || this.genoChars[1][5]==1) break wingSize;

         // miniature (sex-linked recessive, chromosome I-X, locus 6)
         if (!this.momsEgg.chroms[0].genes[5].isWT) this.genoChars[0][5] = 2;
         if (!this.dadsSperm.chroms[0].genes[5].isWT) this.genoChars[1][5] = 2;
         if (this.genoChars[0][5]==2 && (this.isMale ||
               (!this.isMale && this.genoChars[1][5]==2))) this.phenoChars[5] = 2;
         if (this.genoChars[0][5]==2 || (!this.isMale && this.genoChars[1][5]==2)) break wingSize;

         // vestigial (autosomal recessive, chromosome II, locus 7)
         if (!this.momsEgg.chroms[1].genes[6].isWT) this.genoChars[0][5] = 3;
         if (!this.dadsSperm.chroms[1].genes[6].isWT) this.genoChars[1][5] = 3;
         if (this.genoChars[0][5]==3 && this.genoChars[1][5]==3) this.phenoChars[5] = 3;

      }  // end of wing size block

      // Wing Shape (trait 6)
      wingShape: {

         // curly (autosomal dominant and lethal, chromosome II, locus 2)
         if (!this.momsEgg.chroms[1].genes[1].isWT) this.genoChars[0][6] = 1;
         if (!this.dadsSperm.chroms[1].genes[1].isWT) this.genoChars[1][6] = 1;
         if (this.genoChars[0][6]==1 || this.genoChars[1][6]==1) this.phenoChars[6] = 1;
         if (this.genoChars[0][6]==1 && this.genoChars[1][6]==1) this.phenoChars[6] = -1; // lethal
         if (this.genoChars[0][6]==1 || this.genoChars[1][6]==1) break wingShape;

         // curved (autosomal recessive, chromosome II, locus 9)
         if (!this.momsEgg.chroms[1].genes[8].isWT) this.genoChars[0][6] = 2;
         if (!this.dadsSperm.chroms[1].genes[8].isWT) this.genoChars[1][6] = 2;
         if (this.genoChars[0][6]==2 && this.genoChars[1][6]==2) this.phenoChars[6] = 2;
         if (this.genoChars[0][6]==2 || this.genoChars[1][6]==2) break wingShape;

         // dumpy (autosomal recessive, chromosome II, locus 3)
         if (!this.momsEgg.chroms[1].genes[2].isWT) this.genoChars[0][6] = 3;
         if (!this.dadsSperm.chroms[1].genes[2].isWT) this.genoChars[1][6] = 3;
         if (this.genoChars[0][6]==3 && this.genoChars[1][6]==3) this.phenoChars[6] = 3;
         if (this.genoChars[0][6]==3 || this.genoChars[1][6]==3) break wingShape;

         // scalloped (sex-linked recessive, chromosome I-X, locus 8)
         if (!this.momsEgg.chroms[0].genes[7].isWT) this.genoChars[0][6] = 4;
         if (!this.dadsSperm.chroms[0].genes[7].isWT) this.genoChars[1][6] = 4;
         if (this.genoChars[0][6]==4 && (this.isMale ||
               (!this.isMale && this.genoChars[1][6]==4))) this.phenoChars[6] = 4;

      }  // end of wing shape block

      // Wing Veins (trait 7)
      wingVeins: {

         // crossveinless (sex-linked recessive, chromosome I-X, locus 3)
         if (!this.momsEgg.chroms[0].genes[2].isWT) this.genoChars[0][7] = 1;
         if (!this.dadsSperm.chroms[0].genes[2].isWT) this.genoChars[1][7] = 1;
         if (this.genoChars[0][7]==1 && (this.isMale ||
               (!this.isMale && this.genoChars[1][7]==1))) this.phenoChars[7] = 1;
         if (this.genoChars[0][7]==1 || (!this.isMale && this.genoChars[1][7]==1)) break wingVeins;

         // incomplete (autosomal recessive, chromosome III, locus 3)
         if (!this.momsEgg.chroms[2].genes[2].isWT) this.genoChars[0][7] = 2;
         if (!this.dadsSperm.chroms[2].genes[2].isWT) this.genoChars[1][7] = 2;
         if (this.genoChars[0][7]==2 && this.genoChars[1][7]==2) this.phenoChars[7] = 2;

      }  // end of wing veins block

      // Wing Angle (trait 8)

      // dichaete (autosomal dominant and lethal, chromosome III, locus 2)
      if (!this.momsEgg.chroms[2].genes[1].isWT) this.genoChars[0][8] = 1;
      if (!this.dadsSperm.chroms[2].genes[1].isWT) this.genoChars[1][8] = 1;
      if (this.genoChars[0][8]==1 || this.genoChars[1][8]==1) this.phenoChars[8] = 1;
      if (this.genoChars[0][8]==1 && this.genoChars[1][8]==1) this.phenoChars[8] = -1; // lethal

      // Body Color (trait 9)
      bodyColor: {

         // black (autosomal recessive, chromosome II, locus 4)
         if (!this.momsEgg.chroms[1].genes[3].isWT) this.genoChars[0][9] = 1;
         if (!this.dadsSperm.chroms[1].genes[3].isWT) this.genoChars[1][9] = 1;
         if (this.genoChars[0][9]==1 && this.genoChars[1][9]==1) this.phenoChars[9] = 1;
         if (this.genoChars[0][9]==1 || this.genoChars[1][9]==1) break bodyColor;

         // ebony (autosomal recessive, chromosome III, locus 7)
         if (!this.momsEgg.chroms[2].genes[6].isWT) this.genoChars[0][9] = 2;
         if (!this.dadsSperm.chroms[2].genes[6].isWT) this.genoChars[1][9] = 2;
         if (this.genoChars[0][9]==2 && this.genoChars[1][9]==2) this.phenoChars[9] = 2;
         if (this.genoChars[0][9]==2 || this.genoChars[1][9]==2) break bodyColor;

         // sable (sex-linked recessive, chromosome I-X, locus 7)
         if (!this.momsEgg.chroms[0].genes[6].isWT) this.genoChars[0][9] = 3;
         if (!this.dadsSperm.chroms[0].genes[6].isWT) this.genoChars[1][9] = 3;
         if (this.genoChars[0][9]==3 && (this.isMale ||
               (!this.isMale && this.genoChars[1][9]==3))) this.phenoChars[9] = 3;
         if (this.genoChars[0][9]==3 || (!this.isMale && this.genoChars[1][9]==3)) break bodyColor;

         // tan (sex-linked recessive, chromosome I-X, locus 5)
         if (!this.momsEgg.chroms[0].genes[4].isWT) this.genoChars[0][9] = 4;
         if (!this.dadsSperm.chroms[0].genes[4].isWT) this.genoChars[1][9] = 4;
         if (this.genoChars[0][9]==4 && (this.isMale ||
               (!this.isMale && this.genoChars[1][9]==4))) this.phenoChars[9] = 4;
         if (this.genoChars[0][9]==4 || (!this.isMale && this.genoChars[1][9]==4)) break bodyColor;

         // yellow (sex-linked recessive, chromosome I-X, locus 1)
         if (!this.momsEgg.chroms[0].genes[0].isWT) this.genoChars[0][9] = 5;
         if (!this.dadsSperm.chroms[0].genes[0].isWT) this.genoChars[1][9] = 5;
         if (this.genoChars[0][9]==5 && (this.isMale ||
               (!this.isMale && this.genoChars[1][9]==5))) this.phenoChars[9] = 5;

      }  // end of body color block

      // EPISTASIS
      // Array phenoChars holds the character codes for phenotypic traits.
      // Now we must account for masking of traits.
	
      // if eyeless, set eye color to wildtype
      if (this.phenoChars[4]==2) this.phenoChars[3] = 0;
	
       // if apterous or vestigial, set other wing attributes to wildtype
      if (this.phenoChars[5]==1 || this.phenoChars[5]==3) {
         if (this.phenoChars[6] != -1) this.phenoChars[6] = 0;
         this.phenoChars[7] = 0;
         if (this.phenoChars[8] != -1) this.phenoChars[8] = 0;
       }

      // Compute single integer code value based on phenoChars.
      this.phenoCode = 0;
      this.numTraits = 0;
      for (i=0; i<10; i++) {
         if (this.phenoChars[i] == -1) {
            this.phenoCode = -1;
            break;
         }
         else {
            this.phenoCode =  this.phenoCode + this.phenoChars[i] * Math.pow(8,i);
         }
         if (i > 0 && this.phenoChars[i] > 0) this.numTraits++; 
      }
   }

   // update sex, numHeteroLoci, and the character codes
   this.update();

   // Poisson model for prob of recombination based on map distance (md).
   // Odd number of crossovers lead to recombination.
   // Scaled so md=1 corresponds to 1% crossover prob.
   this.probRec = function(md) {
      var i = 0;
      var pr = 0;
      var c1 = md * 0.01010135366;
      var c2 = Math.exp(-c1);

      for (i=1; i<20; i=i+2) {
         c2 = c2 * c1 / i;
         pr = pr + c2;
         c2 = c2 * c1 / (i+1);
      }
      return pr;
   }

   // returns array of all possible chromosomes based on recombination  
   this.recombs = function(chromNum) {
      var recombs = [];
      var chrom, recomb1, recomb2;
      var nLoci=0, nRecombs=0, i=0, j=0, lastHetLocus=0;
      var aProb=0.0, mapVal=0.0, prevMapVal=0.0;

	
      // parentally inherited chromosomes
      var momChrom = this.momsEgg.chroms[chromNum-1];
      var dadChrom = this.dadsSperm.chroms[chromNum-1];

      // We are male, so recombination is not a possibility. If asked for
      // chromosome #1, we clone both chromosomes and set probabilities
      // to 0.5. If asked for chromosomes #2-#4, we check to see if there are
      // any heterozygous loci. If so, we clone both chromosomes and set
      // probabilities to 0.5. If not, we clone only one of our chromosomes. */
      if (this.isMale) {
         if (chromNum==1 || this.numHeteroLoci[chromNum-1]>0) {
            chrom = momChrom.clone();
            chrom.prob = 0.5;
            recombs.push(chrom);
            chrom = dadChrom.clone();
            chrom.prob = 0.5;
            recombs.push(chrom);
         } else {
            chrom = momChrom.clone();
            chrom.prob = 1.0;
            recombs.push(chrom);
         }
      }

      // We are female, so recombination is possible. We check to see if
      // there are any heterozygous loci. If not, we clone only one of our
      // chromosomes. If so, we recombine between all heterozygous loci and
      // set probabilities using the map values.
      else {
         if (this.numHeteroLoci[chromNum-1]==0) {
            chrom = momChrom.clone();
            chrom.prob = 1.0;
            recombs.push(chrom);
         } else {

            // number of loci for chromNum
            nLoci = momChrom.numLoci;

            // start with one maternal clone and set probability to 1.0
            chrom = momChrom.clone();
            chrom.prob = 1.0;
            recombs.push(chrom);

            // Check each gene for heterozygosity. If heterozygous, add to array.
            // Next clone and mutate the clone's gene and add to array.
            // Lastly, adjust recombination probabilities.

            for (i=1; i<=nLoci; i++) {
               if (momChrom.genes[i-1].isWT != dadChrom.genes[i-1].isWT) {
                  mapVal = momChrom.genes[i-1].mapVal;
                  aProb = (lastHetLocus > 0) ? this.probRec(mapVal-prevMapVal) : 0.5;
                  prevMapVal = mapVal;
                  nRecombs = recombs.length;
                  for (j=1; j<=nRecombs; j++) {
                     recomb1 = recombs[j-1];   // visit each recombinant
                     recomb2 = recomb1.clone();   // clone each recombinant
                     recomb2.mutateLocus(i);   // mutate the gene

                     // If the genes at the last two heterozygous loci
                     // are from the same parent, the original represents
                     // a noncrossover and the mutated clone represents
                     // a crossover. Probabilities are set accordingly.	
                     if (lastHetLocus == 0) {
                        recomb1.prob = 0.5;   // independent asssortment
                        recomb2.prob = 0.5;   // independent asssortment
                     } else if (((recomb1.genes[lastHetLocus-1].isWT == momChrom.genes[lastHetLocus-1].isWT)
                                 && (recomb1.genes[i-1].isWT == momChrom.genes[i-1].isWT))
                            || ((recomb1.genes[lastHetLocus-1].isWT == dadChrom.genes[lastHetLocus-1].isWT)
                                 && (recomb1.genes[i-1].isWT == dadChrom.genes[i-1].isWT))) {
                        recomb1.prob = recomb1.prob * (1-aProb);  // noncrossover prob
                        recomb2.prob = recomb2.prob * aProb;   // crossover prob
                     } else {
                        recomb1.prob = recomb1.prob * aProb;  // crossover prob
                        recomb2.prob = recomb2.prob * (1-aProb);   // noncrossover prob
                     }
                     recombs.push(recomb2);   // add cloned mutated chromosome to list
                  }
                  lastHetLocus = i;
               }
            }
         }
      }

      // return the array of recombinant chromosomes
      return recombs;
   }

   this.addTrait = function(grp, trt) {
      var i = 0;
      if (grp == 0) {   // sex
         this.dadsSperm.chroms[0].isY = (trt == 0) ? false : true;
     } else {
         // remove other trait mutations for grp
         for (i = 0; i < this.chromLoci[grp-1].length; i++) {
            this.momsEgg.chroms[this.chromLoci[grp-1][i][0]-1].removeMutation(this.chromLoci[grp-1][i][1]);
            this.dadsSperm.chroms[this.chromLoci[grp-1][i][0]-1].removeMutation(this.chromLoci[grp-1][i][1]);
         }
         // set trait at grp to homozygous trt if not wild type
         if (trt > 0) {
            this.momsEgg.chroms[this.chromLoci[grp-1][trt-1][0]-1].addMutation(this.chromLoci[grp-1][trt-1][1]);
            this.dadsSperm.chroms[this.chromLoci[grp-1][trt-1][0]-1].addMutation(this.chromLoci[grp-1][trt-1][1]);
         }
         // if removing AR, and D and SB present, set D-SB back to trans
         if (grp == 2 && trt == 0 && this.phenoChars[1] == 5 && this.phenoChars[8] == 1) {
            if (this.genoChars[0][1] == 5) {   // SB on maternal chromosome
               this.momsEgg.chroms[this.chromLoci[7][0][0]-1].removeMutation(this.chromLoci[7][0][1]);
               this.dadsSperm.chroms[this.chromLoci[7][0][0]-1].addMutation(this.chromLoci[7][0][1]);
            } else {   // SB on paternal chromosome
               this.dadsSperm.chroms[this.chromLoci[7][0][0]-1].removeMutation(this.chromLoci[7][0][1]);
               this.momsEgg.chroms[this.chromLoci[7][0][0]-1].addMutation(this.chromLoci[7][0][1]);
            }
         }
         // make lethal traits heterozygous
         // mutant gene is randomly assigned to one of the chromosomes
         // if two on same linkage group, use trans arrangement
         // if three on chromosome III, put SB and D on same chromosome
         if (grp == 6 && trt == 1) {   // curly wings
            if (this.genoChars[0][4] == 4) {  // star eyes on maternal chromosome
               this.momsEgg.chroms[this.chromLoci[grp-1][trt-1][0]-1].removeMutation(this.chromLoci[grp-1][trt-1][1]);
            } else if (this.genoChars[1][4] == 4) {   // star eyes on paternal chromosome
               this.dadsSperm.chroms[this.chromLoci[grp-1][trt-1][0]-1].removeMutation(this.chromLoci[grp-1][trt-1][1]);            
            } else {  // randomly remove curly wings from one homologous chromosome
               if (Math.random() < 0.5) {
                  this.momsEgg.chroms[this.chromLoci[grp-1][trt-1][0]-1].removeMutation(this.chromLoci[grp-1][trt-1][1]);
               } else {
                  this.dadsSperm.chroms[this.chromLoci[grp-1][trt-1][0]-1].removeMutation(this.chromLoci[grp-1][trt-1][1]);            
               }
            }
         }
         if (grp == 4 && trt == 4) {   // star eyes
            if (this.genoChars[0][6] == 1) {  // curly wings on maternal chromosome
               this.momsEgg.chroms[this.chromLoci[grp-1][trt-1][0]-1].removeMutation(this.chromLoci[grp-1][trt-1][1]);
            } else if (this.genoChars[1][6] == 1) {  // curly wings on paternal chromosome
               this.dadsSperm.chroms[this.chromLoci[grp-1][trt-1][0]-1].removeMutation(this.chromLoci[grp-1][trt-1][1]);            
            } else {  // randomly remove star eyes from one homologous chromosome
               if (Math.random() < 0.5) {
                  this.momsEgg.chroms[this.chromLoci[grp-1][trt-1][0]-1].removeMutation(this.chromLoci[grp-1][trt-1][1]);
               } else {
                  this.dadsSperm.chroms[this.chromLoci[grp-1][trt-1][0]-1].removeMutation(this.chromLoci[grp-1][trt-1][1]);            
               }
            }
         }
         if (grp == 8 && trt == 1) {   // dichaete wings
            if (this.phenoChars[2] != 1 && this.phenoChars[1] != 5) {   // neither AR nor SB present
               // randomly remove dichaete wings from one homologous chromosome
               if (Math.random() < 0.5) {
                  this.momsEgg.chroms[this.chromLoci[grp-1][trt-1][0]-1].removeMutation(this.chromLoci[grp-1][trt-1][1]);
               } else {
                  this.dadsSperm.chroms[this.chromLoci[grp-1][trt-1][0]-1].removeMutation(this.chromLoci[grp-1][trt-1][1]);            
               }
            } else if (this.phenoChars[2] == 1 && this.phenoChars[1] != 5) {   // AR but not SB
               if (this.genoChars[0][2] == 1) {   // aristapedia on maternal chromosome
                  this.momsEgg.chroms[this.chromLoci[grp-1][trt-1][0]-1].removeMutation(this.chromLoci[grp-1][trt-1][1]);
               } else {  // aristapedia on paternal chromosome
                  this.dadsSperm.chroms[this.chromLoci[grp-1][trt-1][0]-1].removeMutation(this.chromLoci[grp-1][trt-1][1]);            
               }
            } else if (this.phenoChars[2] != 1 && this.phenoChars[1] == 5) {   // SB but not AR
               if (this.genoChars[0][1] == 5) {   // stubble on maternal chromosome
                  this.momsEgg.chroms[this.chromLoci[grp-1][trt-1][0]-1].removeMutation(this.chromLoci[grp-1][trt-1][1]);
               } else {  // stubble on paternal chromosome
                  this.dadsSperm.chroms[this.chromLoci[grp-1][trt-1][0]-1].removeMutation(this.chromLoci[grp-1][trt-1][1]);            
               }
            } else {   // both SB and AR present, they have trans arrangement
               if (this.genoChars[0][2] == 1) {   // aristapedia on maternal chromosome
                  this.momsEgg.chroms[this.chromLoci[grp-1][trt-1][0]-1].removeMutation(this.chromLoci[grp-1][trt-1][1]);
               } else {  // aristapedia on paternal chromosome
                  this.dadsSperm.chroms[this.chromLoci[grp-1][trt-1][0]-1].removeMutation(this.chromLoci[grp-1][trt-1][1]);            
               }
            }
         }
         if (grp == 2 && trt == 1) {   // aristapedia antennae
            if (this.phenoChars[8] != 1 && this.phenoChars[1] != 5) {   // neither D nor SB present
               // randomly remove aristapedia from one homologous chromosome
               if (Math.random() < 0.5) {
                  this.momsEgg.chroms[this.chromLoci[grp-1][trt-1][0]-1].removeMutation(this.chromLoci[grp-1][trt-1][1]);
               } else {
                  this.dadsSperm.chroms[this.chromLoci[grp-1][trt-1][0]-1].removeMutation(this.chromLoci[grp-1][trt-1][1]);            
               }
            } else if (this.phenoChars[8] == 1 && this.phenoChars[1] != 5) {   // D but not SB
               if (this.genoChars[0][8] == 1) {   // dichaete on maternal chromosome
                  this.momsEgg.chroms[this.chromLoci[grp-1][trt-1][0]-1].removeMutation(this.chromLoci[grp-1][trt-1][1]);
               } else {  // dichaete on paternal chromosome
                  this.dadsSperm.chroms[this.chromLoci[grp-1][trt-1][0]-1].removeMutation(this.chromLoci[grp-1][trt-1][1]);            
               }
            } else if (this.phenoChars[8] != 1 && this.phenoChars[1] == 5) {   // SB but not D
               if (this.genoChars[0][1] == 5) {   // stubble on maternal chromosome
                  this.momsEgg.chroms[this.chromLoci[grp-1][trt-1][0]-1].removeMutation(this.chromLoci[grp-1][trt-1][1]);
               } else {  // stubble on paternal chromosome
                  this.dadsSperm.chroms[this.chromLoci[grp-1][trt-1][0]-1].removeMutation(this.chromLoci[grp-1][trt-1][1]);            
               }
            } else {   // both D and SB present, they have trans arrangement, link D to SB, put AR on other chromosome
               if (this.genoChars[0][8] == 1) {   // D on maternal, SB on paternal
                  this.momsEgg.chroms[this.chromLoci[grp-1][trt-1][0]-1].removeMutation(this.chromLoci[grp-1][trt-1][1]);
                  this.dadsSperm.chroms[this.chromLoci[0][4][0]-1].removeMutation(this.chromLoci[0][4][1]);
                  this.momsEgg.chroms[this.chromLoci[0][4][0]-1].addMutation(this.chromLoci[0][4][1]);
               } else {  // D on paternal, SB on maternal
                  this.dadsSperm.chroms[this.chromLoci[grp-1][trt-1][0]-1].removeMutation(this.chromLoci[grp-1][trt-1][1]);
                  this.momsEgg.chroms[this.chromLoci[0][4][0]-1].removeMutation(this.chromLoci[0][4][1]);
                  this.dadsSperm.chroms[this.chromLoci[0][4][0]-1].addMutation(this.chromLoci[0][4][1]);
                }
            }
         }
         if (grp == 1 && trt == 5) {   // stubble bristle
            if (this.phenoChars[2] != 1 && this.phenoChars[8] != 1) {   // neither AR nor D present
               // randomly remove stubble bristle from one homologous chromosome
               if (Math.random() < 0.5) {
                  this.momsEgg.chroms[this.chromLoci[grp-1][trt-1][0]-1].removeMutation(this.chromLoci[grp-1][trt-1][1]);
               } else {
                  this.dadsSperm.chroms[this.chromLoci[grp-1][trt-1][0]-1].removeMutation(this.chromLoci[grp-1][trt-1][1]);            
               }
            } else if (this.phenoChars[2] == 1 && this.phenoChars[8] != 1) {   // AR but not D
               if (this.genoChars[0][2] == 1) {   // aristapedia on maternal chromosome
                  this.momsEgg.chroms[this.chromLoci[grp-1][trt-1][0]-1].removeMutation(this.chromLoci[grp-1][trt-1][1]);
               } else {   // aristapedia on paternal chromosome
                  this.dadsSperm.chroms[this.chromLoci[grp-1][trt-1][0]-1].removeMutation(this.chromLoci[grp-1][trt-1][1]);            
               }
            } else if (this.phenoChars[2] != 1 && this.phenoChars[8] == 1) {   // D but not AR
               if (this.genoChars[0][8] == 1) {   // dichaete on maternal chromosome
                  this.momsEgg.chroms[this.chromLoci[grp-1][trt-1][0]-1].removeMutation(this.chromLoci[grp-1][trt-1][1]);
               } else {   // dichaete on paternal chromosome
                  this.dadsSperm.chroms[this.chromLoci[grp-1][trt-1][0]-1].removeMutation(this.chromLoci[grp-1][trt-1][1]);            
               }
            } else {   // both AR and D present, they have trans arrangement
               if (this.genoChars[0][2] == 1) {   // aristapedia on maternal chromosome
                  this.momsEgg.chroms[this.chromLoci[grp-1][trt-1][0]-1].removeMutation(this.chromLoci[grp-1][trt-1][1]);
               } else {   // aristapedia on paternal chromosome
                  this.dadsSperm.chroms[this.chromLoci[grp-1][trt-1][0]-1].removeMutation(this.chromLoci[grp-1][trt-1][1]);            
               }
            }
         }
      }
      this.update();   // update this genotype
   }

   this.gametes = function() {
      var gametes = [];
      var gamete;
      var recombs = [];
      var c = [0, 0, 0, 0];
      var numChroms = [0, 0, 0, 0];
      var i = 0, aProb = 0.0;

      // Create an array of recombinants for each chromosome
      for (i=0; i<4; i++) {
         recombs[i] = this.recombs(i+1);
         numChroms[i] = this.recombs(i+1).length;
      }

      // Create a list of gametes for all possible chromosome combinations
      for (c[0]=0; c[0]<numChroms[0]; c[0]++) {
         for (c[1]=0; c[1]<numChroms[1]; c[1]++) {
            for (c[2]=0; c[2]<numChroms[2]; c[2]++) {
               for (c[3]=0; c[3]<numChroms[3]; c[3]++) {
               aProb = 1.0;
                  for (i=0; i<4; i++) {
                     aProb = aProb * recombs[i][c[i]].prob;
                  }
                  gamete = new Gamete(recombs[0][c[0]], recombs[1][c[1]],
                              recombs[2][c[2]], recombs[3][c[3]]);
                  gamete.prob = aProb;
                  gametes.push(gamete);
               }
            }
         }
      }
      // return array of all possible gametes
      return gametes;
   }

   this.clone = function() {
      // make copies of maternal and paternal gametes
      var momsEggClone = this.momsEgg.clone();
      var dadsSpermClone = this.dadsSperm.clone();
      // use gametes to clone ourself and return new object
      var meClone = new Genotype(momsEggClone, dadsSpermClone);
      return meClone;
   }
}

