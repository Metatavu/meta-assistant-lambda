import Mailgun from "mailgun.js";
import FormData from "form-data";

/**
 * Class for sending emails through Mailgun
 */
namespace Mailer {

    const { MAILGUN_DOMAIN_NAME, MAILGUN_API_KEY } = process.env;
    const mailgun = new Mailgun(FormData);
    const mailer = mailgun.client({ username: "api", key: MAILGUN_API_KEY });

    export const sendMail = async (data: any) => {
        console.log(data);
        try {
            const message = await mailer.messages.create(MAILGUN_DOMAIN_NAME, {
                from: `Do-not Reply <mailgun@${MAILGUN_DOMAIN_NAME}>`,
                to: data.recipient,
                subject: data.subject,
                text: data.text
            });
            return `Succesfully sent emails to: ${data.recipient}`
        } catch (error) {
            console.error(error.toString());
            return `Failed sending emails to: ${data.recipient}`
        }
    } 

}

export default Mailer;