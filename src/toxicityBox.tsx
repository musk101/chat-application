
import {Prediction} from './ToxicityModel';
import React, { useState, useEffect } from "react";
  
  export default function ToxicityBox({predictions} : {predictions :Prediction}){
      console.log(predictions)
    return(
        <div>
           toxicity: {predictions.toxicity ? "true" : "false"}
        </div>
    );
  }
  