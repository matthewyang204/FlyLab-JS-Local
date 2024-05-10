function Gamete(chrom1, chrom2, chrom3, chrom4) {

   // create the array of chromosomes
   this.chroms = [chrom1, chrom2, chrom3, chrom4];

   // set the initial probability
   this.prob = 1.0;

   this.clone = function() {
      // create new gamete with cloned chromosomes
      var theClone = new Gamete(this.chroms[0].clone(),
                        this.chroms[1].clone(),
                        this.chroms[2].clone(),
                        this.chroms[3].clone());
      // copy the probability
      theClone.prob = this.prob;
      return theClone;
   }
}
