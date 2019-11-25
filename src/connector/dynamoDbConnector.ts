import AWS, { AWSError } from "aws-sdk";
import { DocumentClient, GetItemOutput } from "aws-sdk/clients/dynamodb";
import FormAnswer from "../model/formAnswer";

export default class DynamoDbConnector {
  private _client: DocumentClient;
  private tableName: string;
  constructor(tableName: string) {
    let options = {};
    this._client = new AWS.DynamoDB.DocumentClient(options);
    this.tableName = tableName;
  }

  get client(): DocumentClient {
    return this.client;
  }

  public createForm(id: string): void {
    const emptyForm: FormAnswer = {
      id,
      currentAnswer: 1
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
        console.log("DB query failed: return currAnswer=0");
        return 0;
      });
  }
}
