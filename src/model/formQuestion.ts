import Translation from "./translation";

export default interface FormQuestion {
  name: string;
  shortName?: string;
  text: Translation;
  type: string;
  num: number;
  error?: Translation;
  success?: Translation;
}
