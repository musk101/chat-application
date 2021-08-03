
import {Prediction} from './ToxicityModel';
import React, { useState, useEffect } from "react";
  
  export default function ToxicityBox({predictions} : {predictions :Prediction}){
      console.log(predictions)
    return(
        <div style={{color: '#FDF6F0'}}>
           Toxicity: {predictions.toxicity ? "true" : "false"}
           <div>
           Obsecene: {predictions.obscene ? "true" : "false"}
           </div>
           <div>
          Sexual Explicit: {predictions.sexual_explicit ? "true" : "false"}
          </div>
          Threat: {predictions.threat ? "true" : "false"}
           
        </div>
    );
  }
  