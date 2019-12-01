import AWS, { AWSError } from "aws-sdk";
import { DocumentClient, GetItemOutput } from "aws-sdk/clients/dynamodb";
import FormAnswer from "../model/formAnswer";
import Questions from "../questions";

export default class DynamoDbConnector {
  private _client: DocumentClient;
  private tableName: string;
  private formQuestions: Questions;

  constructor(tableName: string) {
    let options = {};
    this._client = new AWS.DynamoDB.DocumentClient(options);
    this.tableName = tableName;
    this.formQuestions = new Questions();
  }

  get client(): DocumentClient {
    return this.client;
  }

  public createForm(id: string): void {
    const emptyForm: FormAnswer = {
      id,
      currentAnswer: 0
    };
    const params = {
      TableName: this.tableName,
      Item: {
        id,
        currentAnswer: emptyForm.currentAnswer
      }
    };
    this._client.put(params, error => {
      if (error) {
        console.error(error);
        return;
      }
    });
  }
  public async getItem(id: string): Promise<FormAnswer> {
    const params = {
      TableName: this.tableName,
      Key: {
        id: id
      }
    };
    return this._client
      .get(params, (error: AWSError, data: GetItemOutput) => {
        if (error) {
          console.error(error);
          return;
        }
        return data.Item;
      })
      .promise()
      .then(res => {
        return res.Item as FormAnswer;
      });
  }

  public async getCurrentAnswer(id: string): Promise<number> {
    const params = {
      TableName: this.tableName,
      Key: {
        id: id
      }
    };
    return this._client
      .get(params, (error: AWSError, data: GetItemOutput) => {
        if (error) {
          console.error(error);
          return;
        }
        return data.Item;
      })
      .promise()
      .then(res => {
        if (res) {
          return (res.Item as FormAnswer).currentAnswer;
        } else {
          return 0;
        }
      })
      .catch(() => {
        console.error("DB query failed: return currAnswer=0");
        return 0;
      });
  }

  public async updateAnswer(id: string, currAnswer: number, val: string): Promise<void> {
    const currFormQuestion = this.formQuestions.getCurrentQuestion(currAnswer);
    if (currFormQuestion && currFormQuestion.shortName) {
      const nextNum = currAnswer + 1;
      const params = {
        TableName: this.tableName,
        Key: {
          id: id
        },
        UpdateExpression: `set currentAnswer = :ans, ${currFormQuestion.name} = ${currFormQuestion.shortName}`,
        ExpressionAttributeValues: this.getExpAttrValue(currFormQuestion.shortName, val, nextNum),
        ReturnValues: "UPDATED_NEW"
      };
      this._client.update(params, (error, data) => {
        if (error) {
          console.error(error);
          return;
        }
      });
    }
  }

  public async increaseCounter(id: string, currAnswer: number): Promise<void> {
    const nextNum = currAnswer + 1;
    const params = {
      TableName: this.tableName,
      Key: {
        id: id
      },
      UpdateExpression: `set currentAnswer = :ans`,
      ExpressionAttributeValues: {
        ":ans": nextNum
      },
      ReturnValues: "UPDATED_NEW"
    };
    this._client.update(params, (error, data) => {
      if (error) {
        console.error(error);
        return;
      }
    });
  }

  private getExpAttrValue(shortName: string, answer: string, num: number): object {
    return JSON.parse(`{":ans" : ${num},"${shortName}" : "${answer}"}`);
  }
}
