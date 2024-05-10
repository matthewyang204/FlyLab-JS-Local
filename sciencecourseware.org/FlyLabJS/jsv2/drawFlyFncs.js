// mirror function for bilateral symmetry
function mirror(ctx, x0, y0, xsc, ysc) {
   ctx.translate(-x0, -y0);
   ctx.scale(1/xsc, 1/ysc);
   ctx.translate(60, 0);
   ctx.scale(-1, 1);
   ctx.translate(-60, 0);
   ctx.scale(xsc, ysc);
   ctx.translate(x0, y0);
}

function createPath(ctx, pathArray) {
   ctx.beginPath();
   ctx.moveTo(pathArray[0][0], pathArray[0][1]);
   for (var i = 1; i < pathArray.length; i++) {
      ctx.bezierCurveTo(pathArray[i][0],pathArray[i][1],pathArray[i][2],pathArray[i][3],pathArray[i][4],pathArray[i][5]);
   }
}

function drawBodyPart(ctx, bPath, bclr) {
   createPath(ctx, bPath);
   ctx.fillStyle = bclr;
   ctx.fill();
   ctx.strokeStyle = "#000000";
   ctx.lineWidth = 2;
   ctx.stroke();
}

function drawHairs(ctx, hairPath, xyVals) {
   ctx.fillStyle = "#000000";
   ctx.strokeStyle = "#000000";
   ctx.lineWidth = 1;
   for (var j = 0; j < xyVals.length; j++) {
      ctx.translate(xyVals[j][0], xyVals[j][1]);
      createPath(ctx, hairPath);
      ctx.fill();
      ctx.stroke();
      ctx.translate(-xyVals[j][0], -xyVals[j][1]);
   }
}

function drawSexcomb(ctx) {
   ctx.translate(-21, 21);
   createPath(ctx, sexcomb);
   ctx.fill();
   ctx.translate(21, -21);
}

function drawBristles(ctx, bType) {
   // 0-5: +, F, SV, SN, SS, SB
   var bPath;
   ctx.fillStyle = "#000000";
   ctx.strokeStyle = "#000000";
   ctx.lineWidth = 2;
   switch (bType) {
      case 0: bPath = normBristles; break;
      case 1: bPath = forkedBristles; break;
      case 3: bPath = singedBristles; break;
      case 4: bPath = spinelessBristles; break;
      case 5: bPath = stubbleBristles;
   }
   if (bType != 2) {
      for (var i = 0; i < bristlesXY.length; i++) {
         ctx.translate(bristlesXY[i][0], bristlesXY[i][1]);
         createPath(ctx, bPath[i]);
         ctx.fill();
         ctx.stroke();
         ctx.translate(-bristlesXY[i][0], -bristlesXY[i][1]);
      }
   }
}

function drawFrontLegs(ctx, bclr, isMale) {
   var x0 = 155, y0 = 937;
   var xsc = 0.07692307, ysc = 0.07692307;
   ctx.save();
   ctx.translate(0, 120);
   ctx.scale(1, -1);
   ctx.scale(xsc, ysc);
   ctx.translate(x0, y0);

   // front legs
   drawBodyPart(ctx, fLeg, bclr);
   mirror(ctx, x0, y0, xsc, ysc);
   drawBodyPart(ctx, fLeg, bclr);
   mirror(ctx, x0, y0, xsc, ysc);

   // draw hairs
   drawHairs(ctx, fLegHair, fLegHairsXY)
   mirror(ctx, x0, y0, xsc, ysc);
   drawHairs(ctx, fLegHair, fLegHairsXY)
   mirror(ctx, x0, y0, xsc, ysc);

   // sex combs
   ctx.fillStyle = "#000000";
   if (isMale) {
      drawSexcomb(ctx);
      mirror(ctx, x0, y0, xsc, ysc);
      drawSexcomb(ctx);
      mirror(ctx, x0, y0, xsc, ysc);
   }
   ctx.translate(-x0, -y0);
   ctx.scale(1/xsc, 1/ysc);
   ctx.restore();
}

function drawMiddleLegs(ctx, bclr) {
   var x0 = 138, y0 = 358;
   var xsc = 0.07692307, ysc = 0.07692307;
   ctx.save();
   ctx.translate(0, 120);
   ctx.scale(1, -1);
   ctx.scale(xsc, ysc);
   ctx.translate(x0, y0);

   // middle legs
   drawBodyPart(ctx, mLeg, bclr);
   mirror(ctx, x0, y0, xsc, ysc);
   drawBodyPart(ctx, mLeg, bclr);
   mirror(ctx, x0, y0, xsc, ysc);

   // draw hairs
   drawHairs(ctx, mLegHair1, mLegHairs1XY)
   drawHairs(ctx, mLegHair2, mLegHairs2XY)
   mirror(ctx, x0, y0, xsc, ysc);
   drawHairs(ctx, mLegHair1, mLegHairs1XY)
   drawHairs(ctx, mLegHair2, mLegHairs2XY)
   mirror(ctx, x0, y0, xsc, ysc);

   ctx.restore();
}

function drawRearLegs(ctx, bclr) {
   var x0 = 183, y0 = 228;
   var xsc = 0.07692307, ysc = 0.07692307;
   ctx.save();
   ctx.translate(0, 120);
   ctx.scale(1, -1);
   ctx.scale(xsc, ysc);
   ctx.translate(x0, y0);

   // draw organs
   ctx.fillStyle = "#000000";
   createPath(ctx, cOrgan);
   ctx.fill();
   mirror(ctx, x0, y0, xsc, ysc);
   createPath(ctx, cOrgan);
   ctx.fill();
   mirror(ctx, x0, y0, xsc, ysc);

   // rear legs
   drawBodyPart(ctx, rLeg, bclr);
   mirror(ctx, x0, y0, xsc, ysc);
   drawBodyPart(ctx, rLeg, bclr);
   mirror(ctx, x0, y0, xsc, ysc);

   // draw hairs
   drawHairs(ctx, rLegHair1, rLegHairs1XY)
   drawHairs(ctx, rLegHair2, rLegHairs2XY)
   mirror(ctx, x0, y0, xsc, ysc);
   drawHairs(ctx, rLegHair1, rLegHairs1XY)
   drawHairs(ctx, rLegHair2, rLegHairs2XY)
   mirror(ctx, x0, y0, xsc, ysc);

   ctx.restore();
}

function drawAbdomen(ctx, bclr, isMale) {
   var x0 = 447.5, y0 = 258;
   var xsc = 0.07692307, ysc = 0.07692307;
   ctx.save();
   ctx.translate(0, 120);
   ctx.scale(1, -1);
   ctx.scale(xsc, ysc);
   ctx.translate(x0, y0);

   // abdomen
   if (isMale) {
      drawBodyPart(ctx, mAb, bclr);
      mirror(ctx, x0, y0, xsc, ysc);
      drawBodyPart(ctx, mAb, bclr);
      mirror(ctx, x0, y0, xsc, ysc);
   } else {
      drawBodyPart(ctx, fAb, bclr);
      mirror(ctx, x0, y0, xsc, ysc);
      drawBodyPart(ctx, fAb, bclr);
      mirror(ctx, x0, y0, xsc, ysc);
   }

   // stripes
   var abStripes = [stripeAb1, stripeAb2, stripeAb3, stripeAb4];
   ctx.fillStyle = "#000000";
   for (var i = 0; i < abStripes.length; i++) { 
      createPath(ctx, abStripes[i]);
      ctx.fill();
      mirror(ctx, x0, y0, xsc, ysc);
      createPath(ctx, abStripes[i]);
      ctx.fill();
      mirror(ctx, x0, y0, xsc, ysc);
   }
   if (isMale) {
      createPath(ctx, mStripeAb5);
      ctx.fill();
      mirror(ctx, x0, y0, xsc, ysc);
      createPath(ctx, mStripeAb5);
      ctx.fill();
      mirror(ctx, x0, y0, xsc, ysc);
   } else {
      createPath(ctx, fStripeAb5);
      ctx.fill();
      createPath(ctx, fStripeAb6);
      ctx.fill();
      mirror(ctx, x0, y0, xsc, ysc);
      createPath(ctx, fStripeAb5);
      ctx.fill();
      createPath(ctx, fStripeAb6);
      ctx.fill();
      mirror(ctx, x0, y0, xsc, ysc);
   }

   // draw hairs
   drawHairs(ctx, abHair, abHairsXY)
   mirror(ctx, x0, y0, xsc, ysc);
   drawHairs(ctx, abHair, abHairsXY)
   mirror(ctx, x0, y0, xsc, ysc);
   if (!isMale) {
      drawHairs(ctx, abHair, fAbHairsXY)
      mirror(ctx, x0, y0, xsc, ysc);
      drawHairs(ctx, abHair, fAbHairsXY)
      mirror(ctx, x0, y0, xsc, ysc);
   }

   ctx.restore();
}

function drawThorax(ctx, bclr, bType) {
   var x0 = 456.5, y0 = 548;
   var xsc = 0.07692307, ysc = 0.07692307;
   ctx.save();
   ctx.translate(0, 120);
   ctx.scale(1, -1);
   ctx.scale(xsc, ysc);
   ctx.translate(x0, y0);

   // thorax
   drawBodyPart(ctx, thorax, bclr);
   mirror(ctx, x0, y0, xsc, ysc);
   drawBodyPart(ctx, thorax, bclr);
   mirror(ctx, x0, y0, xsc, ysc);

   // draw hairs
   drawHairs(ctx, thxHair, thxHairsXY)
   mirror(ctx, x0, y0, xsc, ysc);
   drawHairs(ctx, thxHair, thxHairsXY)
   mirror(ctx, x0, y0, xsc, ysc);

   // draw bristles
   drawBristles(ctx, bType);
   mirror(ctx, x0, y0, xsc, ysc);
   drawBristles(ctx, bType);
   mirror(ctx, x0, y0, xsc, ysc);

   ctx.restore();
}

function drawHeadEyes(ctx, bclr, eclr, eType) {
   var x0 = 477, y0 = 723;
   var xsc = 0.07692307, ysc = 0.07692307;
   ctx.save();
   ctx.translate(0, 120);
   ctx.scale(1, -1);
   ctx.scale(xsc, ysc);
   ctx.translate(x0, y0);

   // eye shape
   // 0-4: +, B, EY, L, ST
   var headPath, eyePath;
   ctx.fillStyle = "#000000";
   ctx.strokeStyle = "#000000";
   ctx.lineWidth = 2;
   switch (eType) {
      case 0: headPath = headOutline; eyePath = eyeOutline; break;
      case 1: headPath = barHeadOutline; eyePath = barEyeOutline; break;
      case 2: headPath = eyelessHeadOutline; break;
      case 3: headPath = lobeHeadOutline; eyePath = lobeEyeOutline; break;
      case 4: headPath = starHeadOutline; eyePath = starEyeOutline; break;
   }

   // draw head
   drawBodyPart(ctx, headPath, bclr);
   mirror(ctx, x0, y0, xsc, ysc);
   drawBodyPart(ctx, headPath, bclr);
   mirror(ctx, x0, y0, xsc, ysc);

   // draw eye
   if (eType != 2) {
      drawBodyPart(ctx, eyePath, eclr);
      mirror(ctx, x0, y0, xsc, ysc);
      drawBodyPart(ctx, eyePath, eclr);
      mirror(ctx, x0, y0, xsc, ysc);
   }

   // draw hairs
   drawHairs(ctx, headHair, headHairsXY)
   mirror(ctx, x0, y0, xsc, ysc);
   drawHairs(ctx, headHair, headHairsXY)
   mirror(ctx, x0, y0, xsc, ysc);

   ctx.restore();
}

function drawAntennae(ctx, bclr, isArista) {
   var x0 = 503, y0 = 768;
   var xsc = 0.07692307, ysc = 0.07692307;
   ctx.save();
   ctx.translate(0, 120);
   ctx.scale(1, -1);
   ctx.scale(xsc, ysc);
   ctx.translate(x0, y0);

   if (isArista) {
      ctx.translate(-x0, -y0);
      ctx.translate(570, 1100);
      drawBodyPart(ctx, arista, bclr);
      drawHairs(ctx, antHair, aristaHairsXY);
      ctx.translate(-570, -1100);
      ctx.translate(x0, y0);
      mirror(ctx, x0, y0, xsc, ysc);
      ctx.translate(-x0, -y0);
      ctx.translate(570, 1100);
      drawBodyPart(ctx, arista, bclr);
      drawHairs(ctx, antHair, aristaHairsXY);
      ctx.translate(-570, -1100);
      ctx.translate(x0, y0);
      mirror(ctx, x0, y0, xsc, ysc);
   } else {
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 2;
      for (var j = 0; j < ant.length; j++) {
         createPath(ctx, ant[j]);
         ctx.stroke();
      }
      drawBodyPart(ctx, antBase, bclr);
      drawHairs(ctx, antHair, antHairsXY);
      mirror(ctx, x0, y0, xsc, ysc);
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 2;
      for (var j = 0; j < ant.length; j++) {
         createPath(ctx, ant[j]);
         ctx.stroke();
      }
      drawBodyPart(ctx, antBase, bclr);
      drawHairs(ctx, antHair, antHairsXY);
      mirror(ctx, x0, y0, xsc, ysc);
   }

   ctx.restore();
}


function drawWing(ctx, x0y0, wx0y0, paths, isM, isD) {
   ctx.save();
   ctx.translate(x0y0[0], x0y0[1]);
   if (isD) {  // dichaete
      ctx.translate(wx0y0[0], wx0y0[1]);
      ctx.rotate(-30 * Math.PI / 180);
      ctx.translate(-wx0y0[0], -wx0y0[1]);
   }
   if (isM) {  // miniature
      ctx.translate(wx0y0[0], wx0y0[1]);
      ctx.scale(0.75, 0.75);
      ctx.translate(-wx0y0[0], -wx0y0[1]);
   }
   // wing outline
   ctx.globalAlpha = 0.3333;
   ctx.fillStyle = "#FFFFFF";
   createPath(ctx, paths[0]);
   ctx.fill();
   ctx.globalAlpha = 1;
   ctx.strokeStyle = "#000000";
   ctx.lineWidth = 1;
   ctx.stroke();
   // wing veins
   for (var j = 0; j < paths[1].length; j++) {
      createPath(ctx, paths[1][j]);
      ctx.stroke();
   }
   // normal or RI veins
   for (var j = 0; j < paths[2].length; j++) {
      createPath(ctx, paths[2][j]);
      ctx.stroke();
   }
   // crossveins
   for (var j = 0; j < paths[3].length; j++) {
      createPath(ctx, paths[3][j]);
      ctx.stroke();
   }
   ctx.restore();
}

function drawWings(ctx, size, shape, vein, angle) {
   var xsc = 0.2, ysc = 0.2;
   var wingPaths, RIveins, CVveins;
   var isM = 0;
   if (size == 2) isM = 1;
   ctx.save();
   ctx.translate(0, 120);
   ctx.scale(1, -1);
   ctx.scale(xsc, ysc);

   if (size == 0 || size == 2) {  // normal or miniature size

      switch (shape) {
         case 0:  // wild type shape
            if (vein == 2) {  // incomplete veins
               RIveins = wingRImut;
               CVveins = wingCVeins;
            } else if (vein == 1) {  // crossveinless
               RIveins = wingRIVeins;
               CVveins = [];
            } else {  // wild type veins
               RIveins = wingRIVeins;
               CVveins = wingCVeins;
            }
            paths = [wingOutline, wingNormVeins, RIveins, CVveins];
            drawWing(ctx, wingX0Y0[shape], wingOriginX0Y0[shape], paths, isM, angle);
            mirror(ctx, 0, wingX0Y0[shape][1], xsc, ysc);
            drawWing(ctx, wingX0Y0[shape], wingOriginX0Y0[shape], paths, isM, angle);
            mirror(ctx, 0, wingX0Y0[shape][1], xsc, ysc);
         break;

         case 1:   // curly wings
            // lower parts
            if (vein == 2) {  // incomplete veins
               RIveins = curly1RImut;
               CVveins = curly1CVeins;
            } else if (vein == 1) {  // crossveinless
               RIveins = curly1RInorm;
               CVveins = [];
            } else {  // wild type veins
               RIveins = curly1RInorm;
               CVveins = curly1CVeins;
            }
            paths = [curly1Wing, curly1NVeins, RIveins, CVveins];
            drawWing(ctx, wingX0Y0[shape], wingOriginX0Y0[shape], paths, isM, angle);
            mirror(ctx, 0, wingX0Y0[shape][1], xsc, ysc);
            drawWing(ctx, wingX0Y0[shape], wingOriginX0Y0[shape], paths, isM, angle);
            mirror(ctx, 0, wingX0Y0[shape][1], xsc, ysc);
            // upper parts
            CVveins = [];  // no crossveins on upper part
            if (vein == 2) {  // incomplete veins
               RIveins = [];
            } else {  // wild type veins
               RIveins = curly2RInorm;
               //RIveins = [];
            }
            paths = [curly2Wing, curly2NVeins, RIveins, CVveins];
            //paths = [curly2Wing, [], RIveins, CVveins];
            mirror(ctx, 0, wingX0Y0[shape][1], xsc, ysc);
            drawWing(ctx, wingX0Y0[shape], wingOriginX0Y0[shape], paths, isM, angle);
            mirror(ctx, 0, wingX0Y0[shape][1], xsc, ysc);
            drawWing(ctx, wingX0Y0[shape], wingOriginX0Y0[shape], paths, isM, angle);
         break;

         case 2:  // curved wings
            if (vein == 2) {  // incomplete veins
               RIveins = curvedRImut;
               CVveins = curvedCV;
            } else if (vein == 1) {  // crossveinless
               RIveins = curvedRInorm;
               CVveins = [];
            } else {  // wild type veins
               RIveins = curvedRInorm;
               CVveins = curvedCV;
            }
            paths = [curvedOutline, curvedNVeins, RIveins, CVveins];
            drawWing(ctx, wingX0Y0[shape], wingOriginX0Y0[shape], paths, isM, angle);
            mirror(ctx, 0, wingX0Y0[shape][1], xsc, ysc);
            drawWing(ctx, wingX0Y0[shape], wingOriginX0Y0[shape], paths, isM, angle);
            mirror(ctx, 0, wingX0Y0[shape][1], xsc, ysc);
         break;

         case 3: // dumpy wings
            if (vein == 2) {  // incomplete veins
               RIveins = dumpyRImut;
               CVveins = dumpyCV;
            } else if (vein == 1) {  // crossveinless
               RIveins = dumpyRInorm;
               CVveins = [];
            } else {  // wild type veins
               RIveins = dumpyRInorm;
               CVveins = dumpyCV;
            }
            paths = [dumpyOutline, dumpyNVeins, RIveins, CVveins];
            drawWing(ctx, wingX0Y0[shape], wingOriginX0Y0[shape], paths, isM, angle);
            mirror(ctx, 0, wingX0Y0[shape][1], xsc, ysc);
            drawWing(ctx, wingX0Y0[shape], wingOriginX0Y0[shape], paths, isM, angle);
            mirror(ctx, 0, wingX0Y0[shape][1], xsc, ysc);
         break;

         case 4:  // scalloped wings
            if (vein == 2) {  // incomplete veins
               RIveins = scallopedRImut;
               CVveins = scallopedCV;
            } else if (vein == 1) {  // crossveinless
               RIveins = scallopedRInorm;
               CVveins = [];
            } else {  // wild type veins
               RIveins = scallopedRInorm;
               CVveins = scallopedCV;
            }
            paths = [scallopedOutline, scallopedNVeins, RIveins, CVveins];
            drawWing(ctx, wingX0Y0[shape], wingOriginX0Y0[shape], paths, isM, angle);
            mirror(ctx, 0, wingX0Y0[shape][1], xsc, ysc);
            drawWing(ctx, wingX0Y0[shape], wingOriginX0Y0[shape], paths, isM, angle);
            mirror(ctx, 0, wingX0Y0[shape][1], xsc, ysc);
         break;
      }
   } else if (size == 3) {  // vestigial
      CVveins = [];
      RIveins = [];
      paths = [vestigialOutline, vestigialVeins, RIveins, CVveins];
      drawWing(ctx, wingX0Y0[shape], [0,0], paths, 0, 0);
      mirror(ctx, 0, wingX0Y0[shape][1], xsc, ysc);
      drawWing(ctx, wingX0Y0[0], [0,0], paths, 0, 0);
      mirror(ctx, 0, wingX0Y0[0][1], xsc, ysc);
   }
   ctx.restore();
}