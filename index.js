const fs = require("fs");
const http = require("http");
const url = require("url");

const { replaceTemplate } = require("./replaceTemplate");

// console.log(__dirname);

const fileData = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const tempCard = fs.readFileSync(`${__dirname}/templates/card.html`, "utf-8");
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/overview.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/product.html`,
  "utf-8"
);
const productData = JSON.parse(fileData);
// console.log(productData);

const server = http.createServer((req, res) => {
  //one usage of true keyword i observed is that we get object for the whole query string but without it we just get a string which is really hard to use than the object
  const { query, pathname } = url.parse(req.url, true);

  //overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "content-type": "text/html" });
    const cards = productData
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const homeOutput = tempOverview.replace("{%PRODUCTCARDS%}", cards);
    res.end(homeOutput);

    //product page
  } else if (pathname === "/product") {
    const product = replaceTemplate(tempProduct, productData[query.id]);

    res.end(product);

    //api
  } else if (pathname === "/api") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(fileData);

    //404
  } else {
    res.writeHead(404);
    res.end("Page not found!");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("listening to port 8000");
});
