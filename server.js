const express = require("express");
const bodyParser = require("body-parser");
//const openai = require("openai");
const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const cors = require("cors");
const fs = require("fs");
const app = express();
app.use(cors());
app.use(bodyParser.json());
const { OpenAI } = require("openai");
const mongoose = require("mongoose");
// mongoose
//   .connect("mongodb+srv://kishore:1234@cluster0.w7w19gv.mongodb.net/gformDB", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("Mongoose connected"))
//   .catch((err) => console.log(err));

// const Query = mongoose.model("Query", {
//   content: String,
//   date: Date,
// });

const openai = new OpenAI({
  apiKey: "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",
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

// Set up OpenAI API credentials
//openai.apiKey = "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";
app.get("/", function (req, res) {
  res.send("Hello world");
});
app.post("/generate-sop", async (req, res) => {
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
  //mongoose
  console.log(req.body);
  const doc = new PDFDocument();
  const pdfFilePath = "output.pdf";
  const pdfStream = fs.createWriteStream(pdfFilePath);
  doc.pipe(pdfStream);
  const prompt = `Create a Statement of Purpose like a formal letter with my name and adress and thank you at the end with the given details : Name: ${name}, Email: ${email}, Age: ${age}, University: ${university}, Degree: ${degree}, Branch: ${branch}, Work Experience: ${workexp}, Institute To: ${instituteto}, Branch To: ${branchto}, Country: ${country}, Goals: ${goals}, Payment Question: ${payQ}, Fee: ${fee}, GIC: ${gic}, Fee GIC: ${feegic}, Generate a Statement of Purpose (SOP) based on the provided information in a formal letter way with more than 2000 words by elaborating about the institutes. Also write thank you and name at the end`;

  //const prompt = `Write a statement of purpose for ${name} applying to MS using ${email}`;
  const completion = await openai.completions.create({
    //engine: 'text-davinci-003', // Adjust the engine as needed
    prompt: prompt,
    max_tokens: 700, // Adjust as needed
    model: "text-davinci-003",
    temperature: 1, // Specify the model to use
  });
  // Process the response from the OpenAI API
  const generatedText = completion.choices[0].text;
  console.log(generatedText);
  // const date = new Date();
  // const newone = new Query({
  //   prompt,
  //   date,
  // });
  // await newone.save();

  // Add content to the PDF
  doc.fontSize(16).text(`Statement of Purpose for ${name}`);
  doc.fontSize(12).text(generatedText);
  doc.end();

  const mailOptions = {
    from: "shelbyltdx5@gmail.com",
    to: email,
    subject: "Your Statement of Purpose",
    text: "Here is your Statement of Purpose in PDF format.",
    attachments: [
      {
        filename: "sop.pdf",
        path: pdfFilePath, // Attach the generated PDF file
        contentType: "application/pdf", // Specify the content type
      },
    ],
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).send("Error sending email");
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).send("Email sent successfully");
    }
  });
});

//prev data

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});

/*
const express = require("express");

const bodyParser = require("body-parser");

const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
// const openai = require('openai');
const PDFDocument = require("pdfkit");
const fs = require("fs");
const { Configuration, OpenAIApi } = require("openai");

const configu = new Configuration({
  apiKey: "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",
});

const openai = new OpenAIApi(configu);
// Set up OpenAI API

// console.log(date);
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/PersonDB", {
  useNewUrlParser: true,
});
// const openaiApiKey = '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';
// // openai.configure({ apiKey: openaiApiKey });
//
// // const openai = require('openai');
// const openaiApi = new OpenAIApi({
//   openaiApiKey,
// });
// openai.configure({
//   apiKey: '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',
// });
// const PersonSchema = new mongoose.Schema({
//   name : String,
//   place:String
// });
//
// const Person = mongoose.model("Item",PersonSchema);
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'shelbyltdx5@gmail.com',
//     pass: 'Shelby@12'
//   }
// });

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

const submittedDataSchema = new mongoose.Schema({
  // name : String,
  email: String,
  // ... Other data fields ...
});

const SubmittedDataModel = mongoose.model("SubmittedData", submittedDataSchema);

app.get("/", (req, res) => {
  res.sendFile("index.html");
});

app.post("/submit", async (req, res) => {
  // const name= req.body.name;
  const email = req.body.email;

  // Save data to MongoDB
  const submittedData = new SubmittedDataModel({
    // name,
    email,
    // ... Other data fields ...
  });

  await submittedData.save();

  // Send email to user
  // const mailOptions = {
  //   from: 'shelbyltdx5@gmail.com',
  //   to: email,
  //   subject: 'Submission Confirmation',
  //   text: 'Thank you for submitting the form.'
  // };
  //
  // transporter.sendMail(mailOptions, (error, info) => {
  //   if (error) {
  //     console.log('Error sending email: ', error);
  //   } else {
  //     console.log('Email sent: ', info.response);
  //   }
  // });
  //
  // res.send('Data submitted successfully');
  //  // const obj=new Person({
  //   name:req.body.name,
  //   place:req.body.place
  // })
  // obj.save().then(()=>{
  //   console.log("Success");
  // }).catch((err)=> console.log(err));
  // res.send("Sent");
  const prompt = `Write a statement of purpose for subhash applying to cse. coder . software developer`;
  // const prompt = `Write a statement of purpose for ${student.name} applying to ${student.program}. ${student.achievements}. ${student.goals}`;
  const openaiResponse = await openai.Completion.create({
    engine: "text-davinci-003", // Adjust the engine as needed
    prompt: prompt,
    max_tokens: 300, // Adjust as needed
  });

  // Create PDF using PDFKit
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream("sop.pdf"));
  doc.fontSize(12).text(openaiResponse.choices[0].text);

  // Send email with generated PDF
  const mailOptions = {
    from: "your_email",
    to: email,
    subject: "Your Statement of Purpose",
    text: "Please find your SOP attached.",
    attachments: [
      {
        filename: "sop.pdf",
        path: "sop.pdf",
      },
    ],
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });

  res.send("SOP generated and sent to your email.");
});

app.listen(3001, () => {
  console.log("The server has started at port 3000");
});
*/
