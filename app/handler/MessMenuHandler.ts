import express from "express"
import puppeteer from "puppeteer-core"
import CONST from "../../utils/Const"
import {errorToJSON} from "../../utils/Helpers";

async function MessMenuHandler(req: express.Request, res: express.Response) {
    const meals: string[] = ["breakfast", "lunch", "high_tea", "dinner"]

    // Check for browser env
    const browserPath = process.env.CHRPATH
    if (!browserPath) {
        res.status(500).send(errorToJSON("No exported variable `CHRPATH` found in env."))
        console.error("No exported variable `CHRPATH` found in env.")
        return
    }

    // Load and render page
    const browser = await puppeteer.launch({executablePath: browserPath, args: ['--no-sandbox']}).catch(e => {
        console.error(e);
        res.status(500).send(errorToJSON(e))
    })

    if (!browser)
        return

    const page = await browser.newPage().catch(err => {
        console.error(err)
        res.status(500).send(errorToJSON(err))
    })

    if (!page)
        return

    // Send the request to the new page
    await page.goto(CONST.MESS_MENU_URL).catch(err => {
        console.error(err);
        res.status(500).send(errorToJSON(err))
    })

    await page.waitForTimeout(1000).catch(err => {
        console.error(err)
        res.status(500).send(errorToJSON(err))
    })

    // Now all that we have to do is wait eavluate the xPATHS
    const xPaths: string[] = [
        '//*[@id="root"]/div/div[2]/div[2]/div[2]/div[1]/p',
        '//*[@id="root"]/div/div[2]/div[2]/div[2]/div[2]/p',
        '//*[@id="root"]/div/div[2]/div[2]/div[2]/div[3]/p',
        '//*[@id="root"]/div/div[2]/div[2]/div[2]/div[4]/p'
    ]

    let resp: { [k: string]: string | string[] } = {}

    // get the last updated date
    const lastUpdatedAt = await page.$x('//*[@id="root"]/div/div[2]/div[2]/div[2]/p').then(xPath => {
        return page.evaluate(e => e.textContent, xPath[0])
            .then(val => val as string)
    }).catch(err => {
        console.error(err)
        return ""
    })

    resp["last_updated_at"] = lastUpdatedAt.split('-')[1].trim()

    // Prepare the values
    for (let i = 0; i < meals.length; i++) {
        try {
            const currMeal = await page.$x(xPaths[i]).then(xPath => {
                return page.evaluate(e => e.textContent, xPath[0])
                    .then(val => val as string)
                    .catch(() => {
                        return "NA"
                    })
            })

            resp[meals[i]] = currMeal.split(',').map(m => m.trim())

        } catch (e) {
            console.error(e)
        }
    }

    // Find last updated meal
    resp["last_updated_meal"] = "NA"
    for (let meal of meals) {
        if (resp[meal] != 'Not yet updated.') {
            resp["last_updated_meal"] = meal
        }
    }

    // Close the browser
    await browser.close()

    // Send the repsonse
    res.send(resp)
}

export default MessMenuHandler
