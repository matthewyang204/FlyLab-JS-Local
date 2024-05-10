function Mendel(repNum) {

   // average number of offspring per cross
   this.numOffspring= repNum;

   // cross number
   this.cross = 0;

   this.mate = function(femaleFly, maleFly) {
      var phenoOffspring = [];
      var genoOffspring = [];
      var mother, father, offspring;
      var i = 0, j = 0;
      var newProb = 0.0;

      // check that parents are of opposite sex
      if (femaleFly.isMale == maleFly.isMale) {
         alert("Mating not possible because parent flies do not have different sexes.");
         return -1;
      }

      // get parent genotypes
      if (maleFly.isMale) {
         mother = femaleFly.pickGenotype();
         father = maleFly.pickGenotype();
      } else {
         father = femaleFly.pickGenotype();
         mother = maleFly.pickGenotype();
      }

      // check that mutations are from different categories
      var momChars = mother.genoChars;
      var dadChars = father.genoChars;
      var momChar = 0, dadChar = 0;
      var mutGroup = "";
      var alertTxt = "";
      for (i=1; i<10; i++) {
         momChar = (momChars[0][i] > 0) ? momChars[0][i] : momChars[1][i];
         dadChar = (dadChars[0][i] > 0) ? dadChars[0][i] : dadChars[1][i];
         if (momChar*dadChar > 0 && momChar != dadChar) {
            switch (i) {
               case 1:
                  mutGroup = "bristle";
                  break;
               case 2:
                  mutGroup = "antennae";
                  break;
               case 3:
                  mutGroup = "eye color";
                  break;
               case 4:
                  mutGroup = "eye shape";
                  break;
               case 5:
                  mutGroup = "wing size";
                  break;
               case 6:
                  mutGroup = "wing shape";
                  break;
               case 7:
                  mutGroup = "wing vein";
                  break;
               case 8:
                  mutGroup = "wing angle";
                  break;
               case 9:
                  mutGroup = "body color";
                  break;
            }
            alertTxt = "Mating not possible because parent flies have different mutations from the ";
            alertTxt = alertTxt + mutGroup + " group of characters.";
            alert(alertTxt);
            return -2;
         }
      }

      // create a list of the possible gametes produced by each parent
      var momsGametes = mother.gametes();
      var dadsGametes = father.gametes();

      // count the number of both types of gametes
      var eggNum = momsGametes.length;
      var spermNum = dadsGametes.length;

      // check to see that we don't have too many offspring types. */
      if (eggNum*spermNum > 256) {
         alert("Mating not possible. This mating could result in " + (eggNum*spermNum).toString() + " different genetic combinations!  Try a simpler cross.");
         return -3;
      }

      // pair every egg with every sperm to form the offspring genotypes
      for (i=0; i<eggNum; i++) {
         for (j=0; j<spermNum; j++) {
            genoOffspring.push(new Genotype(momsGametes[i], dadsGametes[j]));
         }
      }

      // form phenotypes from the offspring genotypes
      var lostProb = 0.0;
      var newPhenotype = true;
      for (i=0; i<genoOffspring.length; i++) {
         offspring = genoOffspring[i];
         // Check to see if the phenotype is viable. If not, keep track of the "lost" probability.
         if (offspring.phenoCode == -1) {
            lostProb = lostProb + offspring.prob;
         } else {
            // Check to see if the phenotype for this genotype is new.
            // If yes, create the phenotype with the genotype. If no,
            // add the genotype to the already existing phenotype.
            newPhenotype = true;
            for (j=0; j<phenoOffspring.length; j++) {
               if (offspring.phenoCode == phenoOffspring[j].phenoCode) {
                  newPhenotype = false;
                  break;
               }
            }
            if (newPhenotype) {
               phenoOffspring.push(new Phenotype(offspring));
            }
            else {
               phenoOffspring[j].addGenotype(offspring);
            }
         }
      }

      // set replication factors after adjusting the probabilities for dead phenotypes
      for (i=0; i<phenoOffspring.length; i++) {
         phenoOffspring[i].prob = phenoOffspring[i].prob / (1.0 - lostProb);
         // std normal random variable
         var u = 0, v = 0;
         while(u === 0) u = Math.random();   //Converting [0,1) to (0,1)
         while(v === 0) v = Math.random();   //Converting [0,1) to (0,1)
         z = Math.sqrt( -2.0 * Math.log(u) ) * Math.cos(2.0 * Math.PI * v ); 
         // binomial approx 
         z = this.numOffspring * phenoOffspring[i].prob
             + z * Math.sqrt(this.numOffspring * phenoOffspring[i].prob * (1.0-phenoOffspring[i].prob));
         phenoOffspring[i].repNum = (z < 1.0) ? 1 : Math.ceil(z);
      }

      // sort offspring phenotypes according to numTraits and then phenoCode
      phenoOffspring.sort(function(a, b){return (a.numTraits*Math.pow(8,10)+a.phenoCode) - (b.numTraits*Math.pow(8,10)+b.phenoCode)});

      // increase the cross number
      this.cross++;

      // return the array of phenotypes with parents followed by offspring
      phenoOffspring.unshift(new Phenotype(father));
      phenoOffspring.unshift(new Phenotype(mother));
      return phenoOffspring;
   }
}
