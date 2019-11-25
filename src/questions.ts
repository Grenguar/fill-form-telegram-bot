import FormQuestion from "./model/formQuestion";

export default class Questions {
  public getQuestions(): FormQuestion[] {
    return [
      {
        text: "Привет! Меня зовут Иван Гиков. Я помогу тебе оставить заявку на консультацию в Гик Экспорт.",
        type: "string",
        num: 0
      },
      {
        text: "Как Вас Зовут?",
        type: "string",
        num: 1
      },
      {
        text: "Какой у Вас E-mail?",
        type: "string",
        num: 2
      },
      {
        text: "Какой у Вас телефон?",
        type: "string",
        num: 3
      },
      {
        text: "Какое у Вас образование?",
        type: "string",
        num: 4
      },
      {
        text: "Какой у Вас опыт работы?",
        type: "string",
        num: 5
      },
      {
        text: "Почему Вы хотите получить отзыв о Вашем резюме",
        type: "string",
        num: 6
      },
      {
        text: "Загрузите, пожалуйста, Ваше резюме",
        type: "file",
        num: 7
      }
    ];
  }
}
