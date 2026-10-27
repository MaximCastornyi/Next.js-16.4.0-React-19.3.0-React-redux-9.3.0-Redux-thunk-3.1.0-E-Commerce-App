import axios from "axios";

export default async function handler(req, res) {
  // Проверяем, что запрос именно POST
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: "Please add an email address." });
    }

    const { url, data, headers } = mailchimphandler(email);
    await axios.post(url, data, { headers });

    return res.status(200).json({ 
      message: "You have been added to our newsletter successfully." 
    });
  } catch (error) {
    // Безопасный вывод ошибки от Mailchimp API, если она есть
    const errorMsg = error.response?.data?.detail || error.message;
    return res.status(500).json({ message: errorMsg });
  }
}

function mailchimphandler(email) {
  const { MAILCHIMP_API_KEY, MAILCHIMP_LIST_ID } = process.env;
  
  if (!MAILCHIMP_API_KEY || !MAILCHIMP_LIST_ID) {
    throw new Error("Mailchimp environment variables are missing.");
  }

  const DATACENTER = MAILCHIMP_API_KEY.split("-")[1];
  const url = `https://${DATACENTER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`;
  
  const data = {
    email_address: email,
    status: "subscribed",
  };

  const base64Key = Buffer.from(`anystring:${MAILCHIMP_API_KEY}`).toString("base64");
  
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Basic ${base64Key}`,
  };

  return { url, data, headers };
}