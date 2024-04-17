import bcrypt from 'bcrypt'
import crypto from "crypto"
import multer from "multer"

export function getPrevLink(baseUrl, result) {
  return baseUrl.replace(`page=${result.page}`, `page=${result.prevPage}`);
}

export function getNextLink(baseUrl, result) {
  return baseUrl.includes('page') ? baseUrl.replace(`page=${result.page}`, `page=${result.nextPage}`) : baseUrl.concat(`?page=${result.nextPage}`);
}

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password)

export function generateRandomString(length) {
  if (typeof length !== 'number' || length <= 0) {
    throw new Error('Invalid length for generateRandomString');
  }

  const randomBytes = crypto.randomBytes(Math.ceil(length / 2));
  const randomString = randomBytes.toString('hex').slice(0, length);
  return randomString;
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      const folder = req.query.folder;
      const subfolder = req.query.subfolder;
      const fullPath = process.cwd() + `/public/img/${folder}/${subfolder}`;
      cb(null, fullPath);
  },
  filename: function (req, file, cb) {
      cb(null, file.originalname);
  },
});

export const uploader = multer({ storage });

