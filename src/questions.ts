import FormQuestion from "./model/formQuestion";
import Translation from "./model/translation";

export default class Questions {
  private _questions: FormQuestion[];
  private _commonError: Translation = {
    en: "Unfortunately, error occured.",
    ru: "К сожалению, произошла ошибка."
  };
  private commonLongStringError: Translation = {
    en: `${this._commonError.en} Field should have no more than 300 chracters`,
    ru: `${this._commonError.ru} Поле должно содержать не более 300 символов.`
  };
  private _welcomeWords: Translation = {
    en: "Hello! My name is John Geeks. I will help you to send a request for the consultation in Geek Export.",
    ru: "Привет! Меня зовут Иван Гиков. Я помогу тебе оставить заявку на консультацию в GeekExport."
  };
  private _finalWords: Translation = {
    en: "Thank you! Youar answers are accepted. We will contact you within 1 day.",
    ru: "Спасибо! Твои ответы приняты. Мы свяжемся с тобой в течение 1 дня."
  };
  private _afterFinalWords = {
    en: "You have already answered for all our questions. Thank you again!",
    ru: "Ты уже ответил на все наши вопросы. Спасибо еще раз!"
  };
  private _typeError = {
    en: "Sorry, but I am not supporting this file type",
    ru: "Извините, но такой тип файлов не поддерживается."
  };

  private _fileSuccess: Translation = {
    en: "File accepted.",
    ru: "Файл принят."
  };

  constructor() {
    this._questions = [
      {
        shortName: ":n",
        name: "username",
        text: {
          en: "What is your name?",
          ru: "Как я могу к тебе обращаться?"
        },
        type: "name",
        num: 0,
        error: {
          en: `${this._commonError.en} Name should contain no more than 50 characters and it should have only letters`,
          ru: `${this._commonError.ru} Имя должно быть не длиннее 50 символов и содержать только буквы`
        }
      },
      {
        shortName: ":e",
        name: "email",
        text: {
          en: "Tell me your E-mail address, please.",
          ru: "Сообщи , пожалуйста, твой E-mail."
        },
        type: "email",
        num: 1,
        error: {
          en: `${this._commonError.en} E-mail should be yourname@yourdomain.com`,
          ru: `${this._commonError.ru} E-mail должен быть yourname@yourdomain.com`
        }
      },
      {
        shortName: ":p",
        name: "phone",
        text: {
          en: "Write me your phone, please.",
          ru: "Напиши, пожалуйста, твой номер телефона."
        },
        type: "phone",
        num: 2,
        error: {
          en: `${this._commonError.ru} Phone number should contain only numeric and +.`,
          ru: `${this._commonError.ru} Номер телефона должен содержать только цифры и +.`
        }
      },
      {
        shortName: ":ed",
        name: "education",
        text: {
          en: "Write me your education and specialization.",
          ru: "Напиши, пожалуйста, какое у тебя образование и специальность (среднее, высшее, студент)"
        },
        type: "longString",
        num: 3,
        error: this.commonLongStringError
      },
      {
        shortName: ":exp",
        name: "experience",
        text: {
          en: "Do you have experience in IT field? (software development, QA, design, games, infrastructure)",
          ru: "Есть ли у тебя опыт работы в сфере IT? (разработка, тестирование, дизайн, игры, инфраструктура)"
        },
        type: "longString",
        num: 4,
        error: this.commonLongStringError
      },
      {
        shortName: ":w",
        name: "why",
        text: {
          en: "Why do you want to have review of your CV?",
          ru: "Какова для тебя цель получить резюме ревью?"
        },
        type: "longString",
        num: 5,
        error: this.commonLongStringError
      },
      {
        shortName: ":u",
        name: "upload",
        text: {
          en: "I will help you with pleasure. Upload, please, your CV in pdf, doc, docx, odt, txt formats",
          ru: "С удовольствием помогу тебе. Загрузи, пожалуйста, свое резюме в формате pdf, doc, docx, odt, txt."
        },
        type: "file",
        num: 6,
        error: {
          en: `${this._commonError.en} File is not accepted. Check the extension. I am accepting: pdf, doc, docx, odt, txt. Also the file should be no more than 15 Mb`,
          ru: `${this._commonError.ru} Файл не принят. Проверьте расширение. Я принимаю: pdf, doc, docx, odt, txt. Также файлы размером не более 15 МБ`
        },
        success: this._fileSuccess
      }
    ];
  }

  get questions(): FormQuestion[] {
    return this._questions;
  }

  get welcomeWords(): Translation {
    return this._welcomeWords;
  }

  get finalWords(): Translation {
    return this._finalWords;
  }

  get afterFinalWords(): Translation {
    return this._afterFinalWords;
  }

  get typeError(): Translation {
    return this._typeError;
  }

  get fileSuccess(): Translation {
    return this._fileSuccess;
  }

  get commonError(): Translation {
    return this._commonError;
  }

  public getCurrentQuestion(curr: number): FormQuestion | undefined {
    let currFormQuestion: FormQuestion = {
      name: "example",
      text: {
        en: "exampleText"
      },
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
