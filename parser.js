const axios = require("axios").default;
const { wrapper } = require("axios-cookiejar-support");
const { CookieJar } = require("tough-cookie");

const JSSoup = require("jssoup").default;

const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));

const getFirstGoods = async () => {
  const headers = {
    "user-agent":
      "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Mobile Safari/537.36",
  };

  const url =
    "https://m.aliexpress.ru/category/202000006/computer-office.html?SortType=default&page=1";

  let res = await client
    .get(url, {
      headers: headers,
    })
    .then(async (data) => {
      return await data.data;
    });

  let soup = new JSSoup(res);

  let goods = soup.findAll(
    "div",
    "product-snippet_ProductSnippet__content__tusfnx"
  );

  let goodsMap = goods.map((el) => {
    return {
      goodLink: `https://aliexpress.ru${el.contents[0].attrs.href}`,
      goodImg: `https:${el.contents[0].contents[0].contents[0].contents[0].contents[0].contents[0].attrs.src}`,
      goodPrice:
        el.contents[1].contents[0].contents[2].contents[1].contents[1].text,
      goodDesc: el.contents[1].contents[0].contents[0].contents[0].text,
    };
  });

  console.log(goodsMap);
};

getFirstGoods();
