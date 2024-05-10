function Chromosome(chromNum, isY) {
      var mapVals = [[0.0, 1.5, 13.7, 21.0, 27.5, 36.1, 43.0, 51.5, 56.7, 57.0],
                    [1.3, 6.1, 13.0, 48.5, 54.5, 55.2, 67.0, 72.0, 75.5, 104.5],
                    [26.0, 41.0, 47.0, 47.5, 58.2, 58.5, 70.7],
                    [2.0, 3.0]];   // map locations for genes

      // instance variables
      this.chromNum = chromNum;   // chromosome number (1-4)
      this.isY = isY;
      if (this.chromNum > 1) {
         this.isY = false;
      } 

      this.prob = 1.0;   // probability
      this.numMut = 0;   // number of mutations
      this.numLethals = 0;   // number of lethal alleles
      this.numLoci = mapVals[chromNum-1].length;   // number of gene loci
      this.genes =[];   // an array of genes

      // initialize the array of genes
      for (var i = 0; i < mapVals[this.chromNum-1].length; i++) {
         this.genes[i] = new Gene(this.chromNum, i, mapVals[this.chromNum-1][i], true, false, false);
      }

      // The dominant and lethal mutations
      switch (this.chromNum) {
         case 1:
            this.genes[9].isDom = true;
            break;
         case 2:
            this.genes[0].isDom = true;
            this.genes[1].isDom = true;
            this.genes[7].isDom = true;
            this.genes[0].isLethal = true;
            this.genes[1].isLethal = true;
            break;
         case 3:
            this.genes[1].isDom = true;
            this.genes[3].isDom = true;
            this.genes[4].isDom = true;
            this.genes[1].isLethal = true;
            this.genes[3].isLethal = true;
            this.genes[4].isLethal = true;
            break;
      }

   this.addMutation = function(locus) {
      if (this.genes[locus-1].isWT) {
         this.genes[locus-1].isWT = false;
         this.numMut = this.numMut + 1;
         if (this.genes[locus-1].isLethal) {
            this.numLethals = this.numLethals + 1;
         }
      }
   }

   this.removeMutation = function(locus) {
      if (!this.genes[locus-1].isWT) {
         this.genes[locus-1].isWT = true;
         this.numMut = this.numMut - 1;
         if (this.genes[locus-1].isLethal) {
            this.numLethals = this.numLethals - 1;
         }
      }
   }

   this.mutateLocus = function(locus) {
      if (this.genes[locus-1].isWT) {
         this.addMutation(locus);
      } else {
         this.removeMutation(locus);
      }
   }

   this.clone = function() {
      var theClone = new Chromosome(this.chromNum, this.isY);
      if (this.numMut > 0) {
         for (var i = 0; i < this.numLoci; i++) {
            theClone.genes[i].isWT = this.genes[i].isWT;
         }
         theClone.numMut = this.numMut;
         theClone.numLethals = this.numLethals;
      }
      theClone.prob = this.prob;

      return theClone;
   }
}
