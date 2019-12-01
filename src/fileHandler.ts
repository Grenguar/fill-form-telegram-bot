import DocumentData from "./model/documentData";
import axios from "axios";
import AWS from "aws-sdk";
import nodemailer from "nodemailer";

export default class FileHandler {
  documentData: DocumentData;
  constructor(documentData: DocumentData) {
    this.documentData = documentData;
  }

  public async copyFileToS3(sendLetter?: boolean, htmlText?: string): Promise<void> {
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
        if (sendLetter && htmlText) {
          console.log("Sending letter");
          this.mailSender(process.env.TO!, process.env.FROM!, filename, buffer, htmlText);
        }
      })
      .catch(e => console.log(e));
  }

  public async mailSender(to: string, from: string, filename: string, buffer: Buffer, htmlText: string): Promise<void> {
    const ses = new AWS.SES();
    const mailOptions = {
      from,
      subject: "New lead",
      html: `<h1>Lead Details</h1>${htmlText}`,
      to,
      attachments: [
        {
          filename,
          content: buffer
        }
      ]
    };
    const transporter = nodemailer.createTransport({
      SES: ses
    });
    transporter.sendMail(mailOptions, function(err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log("Email sent successfully");
      }
    });
  }
}
