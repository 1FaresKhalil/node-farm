"use strict";

var http = require("http");

var fs = require("fs");

var url = require("url");

var data = fs.readFileSync("".concat(__dirname, "/dev-data/data.json"));
var objData = JSON.parse(data); // const textIn = fs.readFileSync("./txt/input.txt", "utf8");
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

var replaceTemplate = function replaceTemplate(temp, product) {
  var output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);
  if (!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  return output;
};

var tempOverview = fs.readFileSync("".concat(__dirname, "/templates/overview.html"), "utf8");
console.log(tempOverview);
var tempProduct = fs.readFileSync("".concat(__dirname, "/templates/product.html"), "utf8");
var tempCard = fs.readFileSync("".concat(__dirname, "/templates/product-card.html"), "utf8");
var cardsHtml = objData.map(function (el) {
  return replaceTemplate(tempCard, el);
});
console.log(cardsHtml);
var output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
var server = http.createServer(function (req, res) {
  if (req.url === "/overview" || req.url === "/") {
    res.writeHead(200, {
      "Content-type": "text/html"
    });
    res.end(output);
  } else if (req.url === "/product") {
    res.end("hello from product");
  } else if (req.url === "/api") {
    res.writeHead(200, {
      "content-type": "application/json"
    });
    res.end(data);
  } else {
    res.writeHead(404, {
      "content-type": "text/html"
    });
    res.end("<h1>wrong ya bro</h1>");
  }
});
server.listen(8000, "127.0.0.1", function () {
  console.log("hello");
});