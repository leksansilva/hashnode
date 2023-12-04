import * as crypto from "crypto";
import express from "express";
import multer from "multer";

const app = express();
const port = 3000;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.static("public"));
app.use(express.json());

app.post("/upload", upload.array("files"), (req, res) => {
  const files = req.files as Express.Multer.File[];
  const fileHashes = calculateFileHashes(files);
  const combinedHash = crypto
    .createHash("sha512")
    .update(fileHashes.join(""))
    .digest("hex");
  res.json({ combinedHash });
});

const calculateFileHashes = (files: Express.Multer.File[]) => {
  const fileHashes: string[] = [];

  files.forEach((file, index) => {
    const fileContent = file.buffer.toString("utf-8");
    const hash = crypto.createHash("sha512").update(fileContent).digest("hex");
    fileHashes.push(hash);
  });
  return fileHashes;
};

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
