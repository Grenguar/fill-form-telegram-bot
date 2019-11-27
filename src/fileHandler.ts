import DocumentData from "./model/documentData";
import axios from "axios";
import AWS from "aws-sdk";

export default class FileHandler {
  documentData: DocumentData;
  constructor(documentData: DocumentData) {
    this.documentData = documentData;
  }

  public async copyFileToS3(): Promise<void> {
    const botToken = process.env.BOT_TOKEN!;
    const fileId = this.documentData.file_id;
    const filename = this.documentData.file_name;
    const telegramFileInfo: any = await axios.get(`https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`);
    const filePath = telegramFileInfo.data.result.file_path;
    const s3 = new AWS.S3();
    axios
      .get(`https://api.telegram.org/file/bot${botToken}/${filePath}`, { responseType: "arraybuffer" })
      .then(response => {
        const buffer = Buffer.from(response.data, "binary");
        s3.putObject({
          Bucket: process.env.BUCKET!,
          Key: filename,
          Body: buffer
        }).promise();
      })
      .catch(e => console.log(e));
  }

  public async mailSender(to: string, from: string): Promise<void> {}
}
