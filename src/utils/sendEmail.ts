import Mailgun from "mailgun-js";

const mailGunClient = new Mailgun({
    apiKey: process.env.MAILGUN_API_KEY || "",
    domain: "sandboxf4ae731f542b44a786ee23bfab8dc714.mailgun.org"
});

const sendEmail = (subject: string, html: string) => {
    const emailData = {
        from: "plusbeauxjours@gmail.com",
        to: "plusbeauxjours@gmail.com",
        subject,
        html
    };
    return mailGunClient.messages().send(emailData);
};

export const sendVerificationEmail = (fullName: string, key: string) => {
    const emailSubject = `Hello! ${fullName}, please verify your email`;
    const emailBody = `Verify your email by clicking <a href="http://puber.com/verification/${key}/">${key}<p>here</p></a>`;
    return sendEmail(emailSubject, emailBody)
}