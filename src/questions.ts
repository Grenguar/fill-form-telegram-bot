import FormQuestion from "./model/formQuestion";

export default class Questions {
  private _questions: FormQuestion[];

  constructor() {
    this._questions = [
      {
        name: "hello",
        text: "Привет! Меня зовут Иван Гиков. Я помогу тебе оставить заявку на консультацию в Гик Экспорт.",
        type: "string",
        num: 0
      },
      {
        shortName: ":n",
        name: "username",
        text: "Как Вас Зовут?",
        type: "string",
        num: 1
      },
      {
        shortName: ":e",
        name: "email",
        text: "Какой у Вас E-mail?",
        type: "string",
        num: 2
      },
      {
        shortName: ":p",
        name: "phone",
        text: "Какой у Вас номер телефон?",
        type: "string",
        num: 3
      },
      {
        shortName: ":ed",
        name: "education",
        text: "Какое у Вас образование?",
        type: "string",
        num: 4
      },
      {
        shortName: ":exp",
        name: "experience",
        text: "Какой у Вас опыт работы?",
        type: "string",
        num: 5
      },
      {
        shortName: ":w",
        name: "why",
        text: "Почему Вы хотите получить отзыв о Вашем резюме?",
        type: "string",
        num: 6
      },
      {
        shortName: ":u",
        name: "upload",
        text: "Загрузите, пожалуйста, Ваше резюме.",
        type: "file",
        num: 7
      }
    ];
  }

  get questions(): FormQuestion[] {
    return this._questions;
  }

  public getCurrentQuestion(curr: number): FormQuestion | undefined {
    let currFormQuestion: FormQuestion = {
      name: "example",
      text: "exampleText",
      type: "string",
      num: -1
    };
    for (let i = 0; i < this._questions.length; i++) {
      if (this._questions[i].num === curr) {
        currFormQuestion = this._questions[i];
        break;
      }
    }
    return currFormQuestion ? currFormQuestion : undefined;
  }
}
