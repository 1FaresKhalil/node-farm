const http = require("http");
const fs = require("fs");
const url = require("url");
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`);
const objData = JSON.parse(data);
// const textIn = fs.readFileSync("./txt/input.txt", "utf8");
// console.log(textIn);
// const textOut = `this is the output text ${textIn}
// created on ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textOut);
// fs.readFile("./txt/start.tssxt", "utf8", (err, data1) => {
//   if (err) {
//     return console.log("Erorrrrrrrrr");
//   }
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile("./txt/append.txt", "utf8", (err, data3) => {
//       console.log(data3);
//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, (err) => {
//         console.log("data is wrriten");
//       });
//     });
//   });
// });
// console.log("data will be writen");
const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);
  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  return output;
};

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/overview.html`,
  "utf8"
);
// console.log(tempOverview);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/product.html`,
  "utf8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/product-card.html`,
  "utf8"
);
const cardsHtml = objData.map((el) => replaceTemplate(tempCard, el));
// console.log(cardsHtml);
const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);

const server = http.createServer((req, res) => {
  console.log(req.url);
  const { query, pathname } = url.parse(req.url, true);
  if (pathname === "/overview" || pathname === "/") {
    res.writeHead(200, { "Content-type": "text/html" });
    res.end(output);
  } else if (pathname === "/product") {
    res.writeHead(200, { "Content-type": "text/html" });
    const output = replaceTemplate(tempProduct, objData[query.id]);
    // console.log(output);
    res.end(output);
  } else if (pathname === "/api") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(data);
  } else {
    res.writeHead(404, { "content-type": "text/html" });
    res.end("<h1>wrong ya bro</h1>");
  }
});
server.listen(null, "https://nodefarm-1fareskhalil.vercel.app", () => {
  console.log("hello");
});
