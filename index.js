const express = require("express")
const axios = require("axios")
const app = express()

const extract_wxa_cards = async (purl) => {
  let html
  rsp = await axios({
    url: purl,
    headers: {
      "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 12_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/7.0.4(0x17000428) NetType/4G Language/zh_CN",
      "Content-Type": "text/html; charset=UTF-8"}
  })
  html = rsp.data
  let unique_wxa_data = []
  const m = html.match(/<[^<>]*?data-miniprogram[^<>]*?>/gm)
  if (m) {
    let wxa_data = []
    const unique = [...new Set(m)]
    for (let ss of unique){
      const app_id = ss.match(/miniprogram-appid="(.*?)"/)[1]
      const wxa_path = ss.match(/miniprogram-path="(.*?)"/)[1]
      let wxa_name = wxa_type = wxa_imageurl = ''
      const m1 = ss.match(/miniprogram-nickname="(.*?)"/)
      const m2 = ss.match(/miniprogram-type="(.*?)"/)
      const m3 = ss.match(/miniprogram-imageurl="(.*?)"/)
      if (m1) { wxa_name = m1[1] }
      if (m2) { wxa_type = m2[1] }
      if (m3) { wxa_type = m3[1] }
      wxa_data.push({
        app_id: app_id,
        wxa_name: wxa_name,
        wxa_path: wxa_path,
        wxa_type: wxa_type,
        wxa_imageurl: wxa_imageurl
      });
    };
    unique_wxa_data = [...new Set(wxa_data)]
  }
  return unique_wxa_data
}

app.get("/", async (req, res) => {
  if (req.query.url===undefined){
    return res.json({'err_msg': 'url query parameter required!'})
  }
  result = await extract_wxa_cards(req.query.url)
  return res.json({'err_msg': '', 'result': result})
})

app.listen(5000, () => {console.log(`app listening on port 5000`)})
