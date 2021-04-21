var express = require('express');
var app = express();
var cors = require('cors');
const puppeteer = require('puppeteer');
const path = require('path');

app.use(cors());

app.use(express.json());

app.use('/images',express.static('images'));

app.post('/', (req, res) => {
    console.log(req.body);
    var url = req.body.url;
    var viewport = req.body.viewport
    console.log("url",url);

    switch(viewport){
        case "desktop":
            var viewportValue = {
                width : 1280,
                height : 950
            }
            break;
        case "Tab":
            var viewportValue = {
                width : 768,
                height : 1024
            }
            break;
        case "Mobile":
            var viewportValue = {
                width : 360,
                height : 640
            }
            break;
    }

    (async () => {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox','--disable-setuid-sandbox']
          })
        const page = await browser.newPage();
        try{
            await page.goto(url);
            await page.setViewport(viewportValue);
            
            const index = path.join(__dirname, 'images', 'example.png');
            await page.screenshot({ path: index});
            await browser.close();
            res.send("/images/example.png");
        }
        catch(e){
            console.log(e);
            res.send("failed");

        }  

      })();
    
   
})


var PORT = process.env.PORT || 4200;
app.listen(PORT, function(err){
    if (err) console.log(err);
    console.log("Server listening on PORT", PORT);
}); 