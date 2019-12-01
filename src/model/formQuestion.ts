export default interface FormQuestion {
  name: string;
  shortName?: string;
  text: string;
  type: string;
  num: number;
  error?: string;
  success?: string;
}
