import * as nodemailer from "nodemailer";
import * as nodemailer_sendgrid from "nodemailer-sendgrid";

let transporter: nodemailer.Transporter;

export async function sendMail() {
  if (transporter === undefined || transporter === null) {
    transporter = nodemailer.createTransport(
      nodemailer_sendgrid({
        apiKey:
          "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"
      })
    );
  }

  const mailOptions: nodemailer.SendMailOptions = {
    from: "bubblehead_says@noreply.com",
    to: "minhtuan.tran96@gmail.com",
    subject: "Hello",
    html: "<p>Hello World!</p>"
  };

  const info = await transporter.sendMail(mailOptions);

  console.log("Message sent: %s", info.messageId);
  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
