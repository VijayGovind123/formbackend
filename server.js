

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const cors = require("cors");
const fs = require("fs");
const app = express();

app.use(cors());
app.use(bodyParser.json());
const mongoose = require("mongoose");
mongoose
  .connect("mongodb+srv://kishore:1234@cluster0.w7w19gv.mongodb.net/gformDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Mongoose connected"))
  .catch((err) => console.log(err));

const Userdata = mongoose.model("User", {
  name: String,
  email: String,
  age: String,
  university: String,
  degree: String,
  branch: String,
  instituteto: String,
  branchto: String,
});

// Define your OpenAI API key
const apiKey = process.env.OPEN; // Replace with your actual API key
const { OpenAI } = require("openai");
const openai = new OpenAI({
  apiKey: apiKey,
});
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  // port: 465,
  secure: false,
  auth: {
    user: "shelbyltdx5@gmail.com",
    pass: "cakjmihgkfnxtvbd",
  },
});

// Define a function to generate a custom letter
function generateCustomLetter(reqBody) {
  const {
    name,
    email,
    age,
    university,
    degree,
    branch,
    workexp,
    instituteto,
    branchto,
    country,
    goals,
    payQ,
    fee,
    gic,
    feegic,
  } = reqBody;

  const doc = new PDFDocument();
  const pdfFilePath = "output.pdf";
  const pdfStream = fs.createWriteStream(pdfFilePath);
  doc.pipe(pdfStream);

  // Create the custom letter content in a formal manner
  doc.fontSize(16).text(`Statement of Purpose for ${name}`);
  doc.moveDown(0.5);
 doc.moveDown(1);
 doc.fontSize(16).text(`Hi ${name},`);
  doc.moveDown(1);
  doc.fontSize(12).text("Thanks for using our free SOP drafting service! Your SOP is attached below.");
  doc.moveDown(1);
  doc.fontSize(12).text("If you would like further help as follows:");
  doc.moveDown(0.2);
  doc.fontSize(12).text("1. Get a complete statement of purpose framed/reviewed by our experts - Buy it here:", {
    link: "https://effizient-immigration-inc.square.site/product/sop/9?cp=true&sa=true&sbp=false&q=false",
  });
  doc.fontSize(12).text("2. Get your visa application reviewed before submission to IRCC");
  doc.moveDown(0.2);
  doc.fontSize(12).text("Feel free to contact us!");
  doc.moveDown(0.1);
  doc.fontSize(12).text("226-774-9168");
  doc.moveDown(0.1);
  doc.fontSize(12).text("info@effizient.ca");
  doc.moveDown(0.1);
  doc.fontSize(12).text("www.effizieint.ca");
  doc.moveDown(0.1);
  doc.fontSize(12).text("We will get you going with your visa application in no time. This will all be remote, which means you won’t have any hassle at all!");
  doc.moveDown(0.1);
  doc.fontSize(12).text("Best Regards,");
  doc.moveDown(0.2);
  doc.fontSize(12).text("Team Effizient");
  doc.moveDown(1);
  doc.moveDown(1);

  doc.fontSize(12).text(`From\n${name}\n(Address)\n${email}`);
  doc.moveDown(1);
  doc.moveDown(0.3);
  doc.fontSize(12).text("To");
  doc.fontSize(12).text("Visa Officer");
  doc.fontSize(12).text("High Commission of Canada");
  doc.fontSize(12).text("Subject: Statement of Purpose for studying in Canada");
  doc.moveDown(1);
  doc.moveDown(1);

  // Customize the body of the letter with the provided form data
  doc.fontSize(12).text(`Dear Sir/Madam,`);
  doc.moveDown(1);
  doc.fontSize(12).text(`I would like to take this opportunity to introduce myself as ${name}, a ${age}-year-old individual from ${country}. I have recently completed my ${degree} from ${university}, and I am now seeking to further my education in Canada.`);
  doc.moveDown(1);
  doc.fontSize(12).text(`I have always been passionate about ${branch}, and I have a strong desire to pursue a career in this field. This passion and love for ${branch} led me to pursue a ${degree} in ${branch}, where I gained a solid foundation in the subject.`);
  doc.moveDown(1);
  doc.fontSize(12).text(`After extensive research, I have found that the program of study in ${branchto} at ${instituteto} is the perfect fit for me. The program offers a comprehensive and interdisciplinary approach to ${branchto}, which will provide me with a well-rounded understanding of the subject.`);
  doc.moveDown(1);
  doc.fontSize(12).text(`Additionally, the faculty at ${instituteto} are highly experienced and skilled, and I believe that studying and working with them will greatly enhance my academic pursuit.`);
  doc.moveDown(1);
  doc.fontSize(12).text(`Furthermore, studying in Canada offers numerous advantages. Canada is known for its excellent education system, which is ranked among the best in the world. The country is also known for its safe and peaceful environment, as well as its superb healthcare facilities. Studying in Canada will not only provide me with a high-quality education, but it will also expose me to diverse cultures and improve my communication skills.`);
  doc.moveDown(1);
  doc.fontSize(12).text(`My future goal is to become a successful and dynamic professional in the field of ${branchto}. I believe that by pursuing my studies in Canada, I will gain the necessary knowledge and skills to achieve this goal. Upon completion of my program, I plan to return to ${country} and contribute to the growth and development of the ${branchto} industry in my home country. I am confident that the education and experience I gain in Canada will make me stand out among my peers and enable me to make a significant impact in the industry.`);
  doc.moveDown(1);
  doc.fontSize(12).text(`In terms of my academic background, I have successfully completed my ${degree} from ${university}, which has provided me with a strong foundation in ${branch}. Additionally, I have achieved an IELTS score of ${feegic} in listening, ${fee} in reading, ${gic} in writing, and ${goals} in speaking, demonstrating my proficiency in the English language.`);
  doc.moveDown(1);
  doc.fontSize(12).text(`In terms of finances, I am fortunate to have the support of my family who will be funding my education in Canada. I have enough finances to cover my tuition fees for the first year and living expenses.`);
  doc.moveDown(1);
  doc.fontSize(12).text(`Dear Madam/Sir, if I am granted the opportunity to study in Canada, I assure you that I will abide by all the rules and regulations set by the Canadian government, the local authorities, and the educational institution.`);
  doc.moveDown(1);
  doc.fontSize(12).text(`I kindly request you to process my visa application as soon as possible. I am grateful for your time and consideration.`);
  doc.moveDown(1);
  doc.fontSize(12).text(`Sincerely,`);
  doc.fontSize(12).text(name);
  doc.end();

  return pdfFilePath;
}

app.get("/", function (req, res) {
  res.send("Hello world");
});

let requestCount = 0;
const rateLimit = 50; // Example rate limit, adjust as needed
let rateLimitExceeded = false;

app.post("/generate-sop", async (req, res) => {
  try {
    const {
      name,
      email,
      age,
      university,
      degree,
      branch,
      workexp,
      instituteto,
      branchto,
      country,
      goals,
      payQ,
      fee,
      gic,
      feegic,
    } = req.body;


    const newUser = new Userdata({
      name: name,
      email: email,
      age: age,
      university: university,
      degree: degree,
      branch: branch,
      instituteto: instituteto,
      branchto: branchto,
    });
    newUser.save();
    let pdfFilePath;
    requestCount++;

    if (requestCount > rateLimit) {
      rateLimitExceeded = true;
    }

    // Generate a custom letter if rate limit exceeds
    if (rateLimitExceeded) {
      console.log("Rate limit exceeded. Generating custom letter...");
      pdfFilePath = generateCustomLetter(req.body);
    } else {
      // Generate the AI-generated SOP
      const prompt = `Create a Statement of Purpose like a formal letter with my name and address and thank you at the end with the given details: Name: ${name}, Email: ${email}, Age: ${age}, University: ${university}, Degree: ${degree}, Branch: ${branch}, Work Experience: ${workexp}, Institute To: ${instituteto}, Branch To: ${branchto}, Country: ${country}, Goals: ${goals}, Payment Question: ${payQ}, Fee: ${fee}, GIC: ${gic}, Fee GIC: ${feegic}, Generate a Statement of Purpose (SOP) based on the provided information in a formal letter way with more than 2000 words by elaborating about the institutes. Also write thank you and name at the end`;

      const completion = await openai.completions.create({
        prompt: prompt,
        max_tokens: 600,
        model: "text-davinci-002",
        temperature: 1,
      });

      // Process the response from the OpenAI API
      const generatedText = completion.choices[0].text;

      // Create a PDF with AI-generated content
      const doc = new PDFDocument();
      pdfFilePath = "output.pdf";
      const pdfStream = fs.createWriteStream(pdfFilePath);
      doc.pipe(pdfStream);

      doc.fontSize(16).text(`Statement of Purpose for ${name}`);
      doc.moveDown(0.5);

      // Add AI-generated content to the PDF
      doc.fontSize(12).text(generatedText);

      doc.end();
    }

    // Send the generated PDF via email
    const mailOptions = {
      from: "shelbyltdx5@gmail.com", // Replace with your Gmail email address
      to: email,
      subject: "Your Statement of Purpose",
      text: `Dear ${name},\n\nHere is your Statement of Purpose in PDF format.\n\n` +
            `Here are the details you provided:\n\n` +
            `Name: ${name}\n` +
            `Email: ${email}\n` +
            `Age: ${age}\n` +
            `University: ${university}\n` +
            `Degree: ${degree}\n` +
            `Branch: ${branch}\n` +
            `Work Experience: ${workexp}\n` +
            `Institute To: ${instituteto}\n` +
            `Branch To: ${branchto}\n` +
            `Country: ${country}\n` +
            `Goals: ${goals}\n` +
            `Payment Question: ${payQ}\n` +
            `Fee: ${fee}\n` +
            `GIC: ${gic}\n` +
            `Fee GIC: ${feegic}\n\n` +
            'Thank you for using our service!\n\n' +
            'Sincerely,\n' +
            'Your Name and Contact Details', // Add your contact details here,
      attachments: [
        {
          filename: "sop.pdf",
          path: pdfFilePath,
          contentType: "application/pdf",
        },
      ],
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        res.status(500).send("Error sending email");
      } else {
        console.log("Email sent: " + info.response);
        res.status(200).send("Email sent successfully");
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
