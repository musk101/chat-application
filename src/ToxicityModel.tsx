import "@tensorflow/tfjs";
import { ToxicityClassifier } from "@tensorflow-models/toxicity";

export type Prediction = {
  indentity_attack: boolean;
  insult: boolean;
  obscene: boolean;
  severe_toxicity: boolean;
  sexual_explicit: boolean;
  threat: boolean;
  toxicity: boolean;
};

export default class ToxicityModel {
  private static model: ToxicityClassifier;
  async init() {
    if (!ToxicityModel.model) {
      ToxicityModel.model = new ToxicityClassifier(0.6, [
        "identity_attack",
        "insult",
        "obscene",
        "severe_toxicity",
        "sexual_explicit",
        "threat",
        "toxicity",
      ]);
      await ToxicityModel.model.load();
      console.log("model is loaded");
    }
  }
  async getSentencePrediction(s: string): Promise<Prediction> {
    let pt: Prediction = {
      indentity_attack: false,
      insult: false,
      obscene: false,
      severe_toxicity: false,
      sexual_explicit: false,
      threat: false,
      toxicity: false,
    };
    try {
      let result = await ToxicityModel.model.classify(s);
      result.forEach((e) => {
        //@ts-ignore
        pt[e.label] = e.results[0].match;
      });
      return pt;
    } catch (e) {
        console.log(e);
      return {
        indentity_attack: false,
        insult: false,
        obscene: false,
        severe_toxicity: false,
        sexual_explicit: false,
        threat: false,
        toxicity: false,
      };
    }
  }
}
