const nodemailer = require('nodemailer')
const crypto = require('crypto');

//function to send email. you can change the values from .env file
exports.sendEmail = async(to,subject,text) =>{
  let transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    service:process.env.MAIL_SERVICE,
    secure:process.env.MAIL_PORT===465?true:false,
    auth: {
      user: process.env.MAIL_USER, 
      pass: process.env.MAIL_PASS, 
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: process.env.MAIL_USER, 
    to, 
    subject, 
    text
  });
}

const encryptionKey = crypto.randomBytes(32).toString('hex'); // 32-byte key for AES-256
const iv = crypto.randomBytes(16); // 16-byte IV for AES-CBC

exports.encrypt = (text) => {
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryptionKey, 'hex'), Buffer.from(iv, 'hex'));
  let encrypted = cipher.update(text, 'utf-8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

exports.decrypt = (text) => {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(encryptionKey, 'hex'), iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');
  return decrypted;
}


