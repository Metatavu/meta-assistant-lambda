import Mailgun from "mailgun.js";
import FormData from "form-data";
import Mustache from "mustache";
import { MailData } from "src/functions/schema";
import { DateTime } from "luxon";
import fs from "fs";

/**
 * Class for sending emails through Mailgun
 */
namespace Mailer {

    const { MAILGUN_DOMAIN_NAME, MAILGUN_API_KEY } = process.env;
    const workingDir = process.cwd();
    const mailgun = new Mailgun(FormData);
    const mailer = mailgun.client({ username: "api", key: MAILGUN_API_KEY });

    export const sendMail = async (data: MailData) => {
        try {
            const message = await mailer.messages.create(MAILGUN_DOMAIN_NAME, {
                from: `Do-not Reply <mailgun@${MAILGUN_DOMAIN_NAME}>`,
                to: data.recipients,
                subject: "Low billing rate alert",
                text: Mustache.render(await loadTemplate("low_billing_rate"), data)
            });
            return `Successfully sent emails to: ${data.recipients}`
        } catch (error) {
            console.error(error.toString());
            return `Failed sending emails to: ${data.recipients}`
        }
    };

    const loadTemplate = (name: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            fs.readFile(`${workingDir}/src/templates/${name}.mustache`, "utf-8", (err: any, content: string) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(content);
                }
            });
        });
    };
}

export default Mailer;