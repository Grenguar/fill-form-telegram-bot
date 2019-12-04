import FormQuestion from "./model/formQuestion";

export default class Questions {
  private _questions: FormQuestion[];
  private commonErrorString = "К сожалению, произошла ошибка.";
  private _welcomeWords = "Привет! Меня зовут Иван Гиков. Я помогу тебе оставить заявку на консультацию в GeekExport.";
  private _finalWords = "Спасибо! Твои ответы приняты. Мы свяжемся с тобой в течение 1 дня.";
  private _afterFinalWords = "Ты уже ответил на все наши вопросы. Спасибо еще раз!";
  private _typeError = "Извините, но такой тип файлов не поддерживается.";

  constructor() {
    this._questions = [
      {
        shortName: ":n",
        name: "username",
        text: "Как я могу к тебе обращаться?",
        type: "name",
        num: 0,
        error: `${this.commonErrorString} Имя должно быть не длиннее 50 символов и содержать только буквы`
      },
      {
        shortName: ":e",
        name: "email",
        text: "Сообщи , пожалуйста, твой E-mail.",
        type: "email",
        num: 1,
        error: `${this.commonErrorString} E-mail должен быть yourname@yourdomain.com`
      },
      {
        shortName: ":p",
        name: "phone",
        text: "Напиши, пожалуйста, твой номер телефона.",
        type: "phone",
        num: 2,
        error: `${this.commonErrorString} Номер телефона должен содержать только цифры и +.`
      },
      {
        shortName: ":ed",
        name: "education",
        text: "Напиши, пожалуйста, какое у тебя образование и специальность (среднее, высшее, студент)",
        type: "longString",
        num: 3,
        error: `${this.commonErrorString} Поле должно содержать не более 300 символов.`
      },
      {
        shortName: ":exp",
        name: "experience",
        text: "Есть ли у тебя опыт работы в сфере IT? (разработка, тестирование, дизайн, игры, инфраструктура)",
        type: "longString",
        num: 4,
        error: `${this.commonErrorString} Поле должно содержать не более 300 символов.`
      },
      {
        shortName: ":w",
        name: "why",
        text: "Какова для тебя цель получить резюме ревью?",
        type: "longString",
        num: 5,
        error: `${this.commonErrorString} Поле должно содержать не более 300 символов.`
      },
      {
        shortName: ":u",
        name: "upload",
        text: "С удовольствием помогу тебе. Загрузи, пожалуйста, свое резюме в формате pdf, doc, docx, odt, txt.",
        type: "file",
        num: 6,
        error: `${this.commonErrorString} Файл не принят. Проверьте расширение. Я принимаю: pdf, doc, docx, odt, txt. Также файлы размером не более 15 МБ`,
        success: "Файл принят."
      }
    ];
  }

  get questions(): FormQuestion[] {
    return this._questions;
  }

  get welcomeWords(): string {
    return this._welcomeWords;
  }

  get finalWords(): string {
    return this._finalWords;
  }

  get afterFinalWords(): string {
    return this._afterFinalWords;
  }

  get typeError(): string {
    return this._typeError;
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
