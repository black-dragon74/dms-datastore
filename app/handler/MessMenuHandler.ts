import express from "express"
import puppeteer from "puppeteer"
import CONST from "../../utils/Const"
import {errorToJSON} from "../../utils/Helpers";

async function MessMenuHandler(req: express.Request, res: express.Response) {
    const meals: string[] = ["breakfast", "lunch", "high_tea", "dinner"]

    // Load and render page
    const browser = await puppeteer.launch().catch(e => {
        console.error(e);
        res.status(500).send(errorToJSON(e))
    })

    if (!browser)
        return

    const page = await browser.newPage()

    // Send the request to the new page
    await page.goto(CONST.MESS_MENU_URL)
    await page.waitForTimeout(1000)

    // Now all that we have to do is wait eavluate the xPATHS
    const xPaths: string[] = [
        '//*[@id="root"]/div/div[2]/div[2]/div[2]/div[1]/p',
        '//*[@id="root"]/div/div[2]/div[2]/div[2]/div[2]/p',
        '//*[@id="root"]/div/div[2]/div[2]/div[2]/div[3]/p',
        '//*[@id="root"]/div/div[2]/div[2]/div[2]/div[4]/p'
    ]

    let resp = new Map<string, string>()

    // get the last updated date
    const lastUpdatedAt = await page.$x('//*[@id="root"]/div/div[2]/div[2]/div[2]/p').then(xPath => {
        return page.evaluate(e => e.textContent, xPath[0])
    }).catch(err => {
        console.error(err)
        return ""
    })

    resp.set("last_updated_at", lastUpdatedAt)

    // Prepare the values
    for (let i = 0; i < meals.length; i++) {
        try {
            let currHandler = await page.$x(xPaths[i])
            const a = await page.evaluate(e => e.textContent, currHandler[0])
            resp.set(meals[i], a == null ? ["Not updated yet"] : a.split(','))
        } catch (e) {
            console.error(e)
        }
    }

    // Close the browser
    await browser.close()

    console.log(resp)

    // Send the repsonse
    res.send([...resp])
}

export default MessMenuHandler